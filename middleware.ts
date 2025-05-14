import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Admin Panel Erişim Kontrolü
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      const payload = jwt.verify(token, SECRET) as { role?: string };

      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/unauthorized', request.url));
      }

      return NextResponse.next();
    } catch (err) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  // Okul Profili Erişim Kontrolü
// if (pathname.startsWith('/schools/')) {
//   const urlParts = pathname.split('/');
//   const schoolId = urlParts[2]; // /schools/5/edit -> '5'
//   const isEditPage = pathname.endsWith('/edit');

//   if (isEditPage) {
//     const token = request.cookies.get('token')?.value;

//     if (!token) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     try {
//       const payload = jwt.verify(token, SECRET) as { id?: string, managedSchoolId?: string };
//       //token ekleninince bu kismi kontrol et
//       // Eğer yetkisi yoksa, edit sayfasına değil, profil sayfasına yönlendir ve hata mesajı ekle
//       if (payload.managedSchoolId !== schoolId) {
//         const url = request.nextUrl;
//         // /schools/5/edit -> /schools/5?error=not-authorized
//         url.pathname = `/schools/${schoolId}`;
//         url.searchParams.set('error', 'not-authorized');
//         return NextResponse.redirect(url);
//       }

//     } catch (err) {
//       return NextResponse.redirect(new URL('/login', request.url));
//     }
//   }

  // Eğer edit değilse (sadece görüntüleme ise), herkes görebilir
  return NextResponse.next();
}




