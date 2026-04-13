import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname === '/') {
    url.pathname = '/live';
    return NextResponse.redirect(url);
  }

  if (url.pathname === '/api/upgrades') {
    url.pathname = '/api/live-upgrades';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/api/upgrades'],
};
