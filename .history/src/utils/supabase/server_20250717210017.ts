// src/utils/supabase/server.ts

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createClient = async () => {
    // 1. Ambil cookieStore di dalam fungsi, bukan di luar
    const cookieStore = await cookies()

    // 2. Buat Supabase client dengan menyediakan implementasi cookie
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                // Implementasi 'get'
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                // Implementasi 'set'
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (_error) {
                        // Opsi `set` dipanggil di server-side,
                        // jadi kita bisa mengabaikan error jika dipanggil dari Route Handler
                        // karena tidak ada cara untuk mengatur cookie dari sana.
                    }
                },
                // Implementasi 'remove'
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (_error) {
                        // Sama seperti 'set', abaikan error jika dipanggil dari Route Handler.
                    }
                },
            },
        }
    )
}