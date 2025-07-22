// File: app/auth/callback/route.ts
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const origin = requestUrl.origin

    if (code) {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)
    }

    // Redirect ke halaman utama
    return NextResponse.redirect(origin)
}