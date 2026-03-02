import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Define public paths that don't require authentication
    const isPublicPath = pathname === '/login' || pathname === '/signup';

    // In a real application, we'd check for a session cookie here.
    // Since we're using localStorage for the token currently (via zustand),
    // we'd need to sync it to a cookie for the middleware to see it.
    const token = request.cookies.get('trackr-token')?.value;

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    if (!isPublicPath && !token && pathname !== '/') {
        // For now, if no token cookie, we'll let it pass but in production
        // this would redirect to /login
        // return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        '/dashboard/:path*',
        '/objectives/:path*',
        '/settings/:path*',
        '/login',
        '/signup',
    ],
};
