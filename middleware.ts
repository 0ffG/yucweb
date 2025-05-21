import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET as string);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Token yoksa login sayfasına yönlendir
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, SECRET);

      if (payload.role !== 'admin') {
        // Yetkisiz rol ana sayfaya yönlendir
        return NextResponse.redirect(new URL('/', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      // Token doğrulama hatası login sayfasına yönlendir
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};