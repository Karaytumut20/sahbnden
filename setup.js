const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    "\n🛠️  Sahibinden Clone - AUTH & MIDDLEWARE DÜZELTME BAŞLATILIYOR...\n" +
    colors.reset,
);

// -------------------------------------------------------------------------
// 1. MIDDLEWARE GÜNCELLEMESİ (Supabase SSR)
// -------------------------------------------------------------------------
const middlewarePath = path.join(__dirname, "middleware.ts");
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
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Korumalı Rotalar
  const protectedRoutes = ['/bana-ozel', '/ilan-ver', '/admin']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/bana-ozel/:path*', '/ilan-ver/:path*', '/admin/:path*'],
}
`;

fs.writeFileSync(middlewarePath, middlewareContent);
console.log(
  colors.green +
    "✅ middleware.ts güncellendi (Next.js 16 uyumlu hale getirildi)." +
    colors.reset,
);

// -------------------------------------------------------------------------
// 2. LIB/SUPABASE.TS GÜNCELLEMESİ (Hibrit Client)
// -------------------------------------------------------------------------
const supabaseLibPath = path.join(__dirname, "lib", "supabase.ts");
const supabaseLibContent = `
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Tarayıcıdaysa Cookie kullanan 'ssr' client, Sunucudaysa düz 'js' client kullan.
// Bu sayede hem Server Component'ler hem de Client Component'ler hatasız çalışır.
const isBrowser = typeof window !== 'undefined';

export const supabase = isBrowser
  ? createBrowserClient(supabaseUrl, supabaseKey)
  : createClient(supabaseUrl, supabaseKey);
`;

fs.writeFileSync(supabaseLibPath, supabaseLibContent);
console.log(
  colors.green +
    "✅ lib/supabase.ts güncellendi (Cookie uyumlu hale getirildi)." +
    colors.reset,
);

console.log(colors.bold + "\n🎉 DÜZELTME TAMAMLANDI!" + colors.reset);
console.log("Şimdi projeyi tekrar başlatabilirsiniz:");
console.log(colors.yellow + "npm run dev" + colors.reset);
