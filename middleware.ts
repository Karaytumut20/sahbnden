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

  let user = null;

  try {
    // Bağlantı hatası olursa (Supabase Paused vb.) çökmemesi için try-catch
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (error) {
    console.error("Middleware Auth Error (Supabase Bağlantı Hatası):", error);
    // Hata durumunda kullanıcı yokmuş gibi davran, site çökmesin
    user = null;
  }

  const path = request.nextUrl.pathname;

  // 1. KULLANICI KORUMASI
  if (path.startsWith('/bana-ozel') || path.startsWith('/ilan-ver')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 2. ADMIN KORUMASI
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!user) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    // Rol kontrolü (Hata durumunda güvenli geçiş)
    try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile?.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url))
        }
    } catch {
        // Profil çekilemezse (DB hatası) anasayfaya at
        return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // 3. LOGIN OLMUŞ KULLANICIYI LOGIN SAYFASINDAN UZAKLAŞTIR
  if (user) {
      if (path === '/login' || path === '/register') {
          return NextResponse.redirect(new URL('/bana-ozel', request.url));
      }
      if (path === '/admin/login') {
          return NextResponse.redirect(new URL('/admin', request.url));
      }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}