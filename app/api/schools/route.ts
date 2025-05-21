import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const schools = await prisma.user.findMany({
      where: { role: 'school' },
      select: { id: true, name: true },
    });

    return NextResponse.json(schools, { status: 200 });
  } catch (error) {
    console.error("Schools API hatası:", error);
    return NextResponse.json({ error: "Okullar alınamadı" }, { status: 500 });
  }
}
