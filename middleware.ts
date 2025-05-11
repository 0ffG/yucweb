import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Korumalı yollar listesi
const protectedRoutes = ['/admin', '/profile', '/donate'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const needsAuth = protectedRoutes.some(route => pathname.startsWith(route));

  if (!needsAuth) {
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const user = verifyToken(token);

  if (!user) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

