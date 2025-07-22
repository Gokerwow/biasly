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
        cookies: async () => getCookies(), // ✅ ini kuncinya
      })

      await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(requestUrl.origin)
  } catch (err) {
    console.error('AUTH CALLBACK ERROR:', err)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
