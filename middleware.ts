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
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}