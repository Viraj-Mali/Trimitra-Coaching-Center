import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PUBLIC_PATHS = ['/', '/en', '/mr'];
const LANG_LOCALES = ['en', 'mr'];
const DEFAULT_LOCALE = 'en';

function getLocaleFromRequest(request: NextRequest): string {
  const acceptLanguage = request.headers.get('Accept-Language') || '';
  if (acceptLanguage.toLowerCase().includes('mr')) return 'mr';
  return DEFAULT_LOCALE;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── i18n: redirect root → /en or /mr ─────────────────────────────────────
  if (pathname === '/') {
    const locale = getLocaleFromRequest(request);
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // ── Auth guard: /student/dashboard/* ─────────────────────────────────────
  if (pathname.startsWith('/student/dashboard')) {
    const token = request.cookies.get('trimitra_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/student/login', request.url));
    }
    const payload = await verifyToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/student/login', request.url));
      response.cookies.delete('trimitra_session');
      return response;
    }
    return NextResponse.next();
  }

  // ── Auth guard: /admin/* ──────────────────────────────────────────────────
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const token = request.cookies.get('trimitra_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    const payload = await verifyToken(token);
    if (!payload || payload.role !== 'ADMIN') {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('trimitra_session');
      return response;
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/student/dashboard/:path*',
    '/admin/:path*',
  ],
};
