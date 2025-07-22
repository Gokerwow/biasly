// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createRouteHandlerClient({ cookies: cookies() })
        // Tukarkan kode otorisasi dengan sesi
        await supabase.auth.exchangeCodeForSession(code)
    }

    // URL untuk redirect setelah login berhasil
    return NextResponse.redirect(requestUrl.origin)
}