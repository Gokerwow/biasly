// File: middleware.ts (di root)
import { updateSession } from '@/utils/supabase/middleware'
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}


const rateLimit = new Map();

export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith('/api/scraper')) {
        const ip = request.headers.get('x-forwarded-for') || 'anonymous';
        const now = Date.now();
        const windowMs = 60 * 1000; // 1 minute
        const maxRequests = 5; // 5 requests per minute

        if (!rateLimit.has(ip)) {
            rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
            return NextResponse.next();
        }

        const rateLimitInfo = rateLimit.get(ip);

        if (now > rateLimitInfo.resetTime) {
            rateLimitInfo.count = 1;
            rateLimitInfo.resetTime = now + windowMs;
            return NextResponse.next();
        }

        if (rateLimitInfo.count >= maxRequests) {
            return NextResponse.json(
                { error: 'Too many requests' },
                { status: 429 }
            );
        }

        rateLimitInfo.count++;
        return NextResponse.next();
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/scraper/:path*'
};
