import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'Okul ID gerekli.' }, { status: 400 });
    }

    // Okulu sil
    const deleted = await prisma.user.delete({
      where: { id: Number(id), role: 'school' },
    });

    return NextResponse.json({ message: 'Okul reddedildi ve silindi.' });
  } catch (error) {
    console.error('Okul reddetme hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
