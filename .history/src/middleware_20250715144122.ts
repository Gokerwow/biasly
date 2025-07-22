// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()

    // Buat Supabase client di dalam middleware. Ini sangat penting untuk sinkronisasi sesi.
    const supabase = createMiddlewareClient({ req, res })

    // Refresh sesi pengguna berdasarkan cookie yang ada.
    // Ini adalah langkah krusial yang akan membuat sesi tersedia di server.
    await supabase.auth.getSession()

    return res
}

// Pastikan middleware hanya berjalan pada path yang diperlukan
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}