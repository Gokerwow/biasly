import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_ROUTES } from '@/constants'

export async function updateSession(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // 1. Get the user
    const { data: { user } } = await supabase.auth.getUser()

    // 2. Define Admin Routes
    const isAdminRoute = ADMIN_ROUTES.some(item => request.nextUrl.pathname.startsWith(item))

    // 3. Security Check
    if (isAdminRoute) {
        if (!user) {
            // Not logged in? Go to login
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Option B: Check database role (Best for scalability)
        // Note: This adds a DB fetch to every navigation, so use sparingly or cache it
        const { data: profile } = await supabase
            .from('profiles')
            .select('role') // Make sure your profile table has a 'role' column
            .eq('id', user.id)
            .single()

        if (profile?.role !== 'admin') {
            // Logged in but not admin? Go to unauthorized page or dashboard
            return NextResponse.redirect(new URL('/unauthorized', request.url))
        }
    }

    return response
}