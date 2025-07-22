// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    try {
        if (code) {
            const supabase = createRouteHandlerClient({
                cookies: () => Promise.resolve(request.cookies), // ✅ GUNAKAN INI!
            })

            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Exchange error:', error)
                return new NextResponse('Failed to exchange code', { status: 500 })
            }
        }

        return NextResponse.redirect(requestUrl.origin)
    } catch (err) {
        console.error('Callback route error:', err)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
