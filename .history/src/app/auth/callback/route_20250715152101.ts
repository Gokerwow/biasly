// app/auth/callback/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies as getCookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  try {
    if (code) {
      const supabase = createRouteHandlerClient({
        cookies: async () => getCookies(), // ✅ jangan lupa async wrapper
      })

      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('exchangeCodeForSession ERROR:', error)
        return new NextResponse('Failed to exchange code', { status: 500 })
      }

      console.log('Session Data:', data)
    }

    return NextResponse.redirect(requestUrl.origin)
  } catch (err) {
    console.error('Unexpected Error in /auth/callback:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
