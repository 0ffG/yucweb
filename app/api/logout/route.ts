import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Çıkış başarılı' });

  // ✅ Token cookie'sini temizle (süreyi 0 yaparak)
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });

  return response;
}
