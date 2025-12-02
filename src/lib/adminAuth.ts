import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'adminAuth';

export function getAdminToken(): string {
  return process.env.ADMIN_TOKEN || 'admin-session-token';
}

export function isRequestAuthorized(req: NextRequest): boolean {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  return Boolean(cookie && cookie === getAdminToken());
}

export function setAdminSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, getAdminToken(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });
}

export function clearAdminSessionCookie(res: NextResponse) {
  res.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}


