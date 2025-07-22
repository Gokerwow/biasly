// app/auth/callback/route.ts

import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    try {
        if (code) {
            const supabase = createServerClient({ cookies })

            const { error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error('Exchange code error:', error)
                return new NextResponse('Auth exchange failed', { status: 500 })
            }
        }

        return NextResponse.redirect(requestUrl.origin)
    } catch (error) {
        console.error('Callback route error:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
