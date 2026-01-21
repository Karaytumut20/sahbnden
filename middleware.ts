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

  // Auth durumunu kontrol et
  // DİKKAT: getUser() kullanıyoruz, getSession() değil. Güvenlik için bu şart.
  const { data: { user } } = await supabase.auth.getUser()

  // Korumalı Rotalar
  const protectedRoutes = ['/bana-ozel', '/ilan-ver', '/ilan-duzenle']
  const isProtected = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Admin Kontrolü
  if (request.nextUrl.pathname.startsWith('/admin')) {
     if (!user) {
         return NextResponse.redirect(new URL('/admin/login', request.url))
     }
     // Gerçek projede burada user.role === 'admin' kontrolü yapılır
  }

  // Normal Kullanıcı Kontrolü
  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}