import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
    const { supabase, response } = createClient(request)
    await supabase.auth.getSession()
    return response
}

export const config = {
    matcher: [
        /*
         * Cocokkan semua path request kecuali yang dimulai dengan:
         * - _next/static (file statis)
         * - _next/image (file optimasi gambar)
         * - favicon.ico (file favicon)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}