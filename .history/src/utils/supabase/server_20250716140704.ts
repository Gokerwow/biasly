// utils/supabase/server.ts

import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/auth-helpers-nextjs'

export async function createClient() {
  const cookieStore = cookies() // ini sudah async di context App Router

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: () => Promise.resolve(cookieStore), // ✅ cara aman
    }
  )
}
