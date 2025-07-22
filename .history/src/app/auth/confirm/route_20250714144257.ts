import { NextResponse, type NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = searchParams.get('next') ?? '/'

    const redirectTo = new URL(next, request.url)

    if (token_hash && type) {
        const supabase = createClient()
        const { error } = await supabase.auth.verifyOtp({ type, token_hash })
        if (!error) {
            // Arahkan ke halaman login dengan pesan sukses setelah verifikasi
            const loginUrl = new URL('/login', redirectTo.origin)
            loginUrl.searchParams.set('message', 'Email confirmed successfully! You can now log in.')
            return NextResponse.redirect(loginUrl)
        }
    }

    // Arahkan ke halaman login dengan pesan error jika token tidak valid
    const errorUrl = new URL('/login', redirectTo.origin)
    errorUrl.searchParams.set('message', 'Failed to confirm email. The link may be invalid or has expired.')
    return NextResponse.redirect(errorUrl)
}