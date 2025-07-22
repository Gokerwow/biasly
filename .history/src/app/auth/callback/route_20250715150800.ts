// Lokasi File: app/auth/callback/route.ts

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Ini adalah cara lain untuk memastikan rute ini dinamis.
// Beberapa versi Next.js lebih merespon pada cara ini.
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        try {
            const supabase = createRouteHandlerClient({ cookies })
            await supabase.auth.exchangeCodeForSession(code)
        } catch (error) {
            console.error('Error exchanging code for session:', error)
            // Redirect ke halaman error jika terjadi masalah
            return NextResponse.redirect(`${requestUrl.origin}/auth/auth-code-error`)
        }
    }

    // Redirect pengguna kembali ke halaman utama setelah login
    return NextResponse.redirect(requestUrl.origin)
}