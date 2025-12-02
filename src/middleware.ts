import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'adminAuth';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Only protect /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const isLoginPage = pathname.startsWith('/admin/login');
  const isAuthed = req.cookies.get(ADMIN_COOKIE)?.value;
  const token = process.env.ADMIN_TOKEN || 'admin-session-token';

  if (!isAuthed || isAuthed !== token) {
    if (!isLoginPage) {
      const url = req.nextUrl.clone();
      url.pathname = '/admin/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // If already authed and on /admin/login, push to dashboard
  if (isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};


