import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Token bulunamadı.' }, { status: 400 });
  }

  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) {
    return NextResponse.json({ error: 'Geçersiz veya süresi dolmuş token.' }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, verificationToken: null }
  });

  // Burada isterseniz bir frontend sayfasına yönlendirebilirsiniz
  return NextResponse.json({ message: 'E-posta basariyla doğrulandi.' });
}
