// File: utils/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async  function createClient() {
    const cookieStore = await cookies()

    // Buat client yang berjalan di sisi server (Server Components, Route Handlers, Server Actions)
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                // Catatan: set dan remove di dalam try-catch block
                // Ini untuk menangani kasus di mana cookies dipanggil dari Server Component
                // yang secara default tidak bisa mengubah cookies. Middleware akan menanganinya.
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Biarkan kosong
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Biarkan kosong
                    }
                },
            },
        }
    )
}