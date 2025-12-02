import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSessionCookie, setAdminSessionCookie } from '@/lib/adminAuth';

// Simple admin login: compares password to env and sets an HttpOnly cookie token
export async function POST(req: NextRequest) {
  const { email, password } = await req.json().catch(() => ({}));
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

  if (!ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, message: 'ADMIN_PASSWORD not configured' }, { status: 500 });
  }

  if (!password || password !== ADMIN_PASSWORD || (ADMIN_EMAIL && email !== ADMIN_EMAIL)) {
    return NextResponse.json({ ok: false, message: 'Invalid credentials' }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  setAdminSessionCookie(res);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  clearAdminSessionCookie(res);
  return res;
}


