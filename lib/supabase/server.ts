import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. DYNAMIC CLIENT (Kullanıcı işlemleri için - Cookie Kullanır)
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component içinde cookie set edilemez
          }
        },
      },
    }
  )
}

// 2. STATIC CLIENT (Cache işlemleri için - Cookie KULLANMAZ)
// unstable_cache içinde bunu kullanacağız.
export function createStaticClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return []
        },
        setAll(cookiesToSet) {
        },
      },
    }
  )
}