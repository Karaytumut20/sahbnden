const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 ADMIN LOGIN PAGE FIX & MIDDLEWARE CHECK...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Onarıldı:${colors.reset} ${filePath}`);
}

// =============================================================================
// APP/ADMIN/LOGIN/PAGE.TSX (GÜVENLİ GİRİŞ SAYFASI)
// =============================================================================
const adminLoginPageContent = `
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Loader2, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Giriş Yap
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!user) throw new Error('Kullanıcı bulunamadı.');

      // 2. Rol Kontrolü (Client-side Check)
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        await supabase.auth.signOut(); // Yetkisiz ise çıkış yap
        throw new Error('Bu alana giriş yetkiniz yok.');
      }

      // 3. Yönlendir (Refresh ile Middleware'in yeni durumu algılamasını sağla)
      window.location.href = '/admin';

    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm border border-gray-200">
        <div className="flex justify-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full">
            <Lock className="text-blue-600" size={32} />
          </div>
        </div>

        <h1 className="text-xl font-bold text-center text-gray-800 mb-6">Yönetici Girişi</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4 flex items-center gap-2">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">E-Posta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md h-10 px-3 outline-none focus:border-blue-500 transition-colors"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md h-10 px-3 outline-none focus:border-blue-500 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold h-10 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Giriş Yap'}
          </button>
        </form>

        <div className="mt-4 text-center text-xs text-gray-400">
           Sadece yetkili personel içindir.
        </div>
      </div>
    </div>
  );
}
`;
writeFile("app/admin/login/page.tsx", adminLoginPageContent);

// =============================================================================
// MIDDLEWARE.TS (GARANTİ OLSUN DİYE TEKRAR EKLİYORUZ - Redirect Loop Fix)
// =============================================================================
const middlewareContent = `
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value, options))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname;

  // 1. KULLANICI KORUMASI
  if (path.startsWith('/bana-ozel') || path.startsWith('/ilan-ver')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. ADMIN KORUMASI (DÖNGÜYÜ ENGELLEYEN MANTIK)
  // '/admin' ile başlayan sayfalarda... AMA '/admin/login' hariç!
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Rol kontrolü
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      // Yetkisiz ise ana sayfaya at
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. LOGIN OLMUŞ KULLANICIYI LOGIN SAYFASINDAN UZAKLAŞTIR
  if (user) {
      if (path === '/login' || path === '/register') {
          return NextResponse.redirect(new URL('/bana-ozel', request.url));
      }
      if (path === '/admin/login') {
          // Admin ise panele, değilse anasayfaya
          const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if (profile?.role === 'admin') {
              return NextResponse.redirect(new URL('/admin', request.url));
          } else {
              return NextResponse.redirect(new URL('/', request.url));
          }
      }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
`;
writeFile("middleware.ts", middlewareContent);

console.log(
  colors.yellow + "\\n⚠️ İŞLEM TAMAMLANDI! Şunları yapın:" + colors.reset,
);
console.log(
  "1. Tarayıcıda 'Gizli Sekme' açın (Eski yönlendirmeleri unutması için).",
);
console.log("2. 'npm run dev' ile projeyi başlatın.");
console.log(
  "3. '/admin' adresine gidin. Giriş yaptıktan sonra panele erişebileceksiniz.",
);
