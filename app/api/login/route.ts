import bcrypt from 'bcrypt';
import prisma from "@/lib/prisma";
import { generateToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { email, password } = await request.json();

  // Kullanıcıyı e-posta ile bul
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: 'Geçersiz email veya şifre.' }, { status: 401 });
  }

  // Şifreyi doğrula
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: 'Geçersiz email veya şifre.' }, { status: 401 });
  }

  // JWT oluştur
  const token = generateToken({ userId: user.id, role: user.role });

  // Yanıtı hazırla
  const response = NextResponse.json({
    message: 'Giriş başarılı',
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      photo: user.photo || null
    }
  });

  // Cookie olarak token'ı set et
  response.cookies.set('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 gün
  });

  return response;
}
