// 📁 app/api/donations/total/route.ts
import prisma  from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const result = await prisma.donation.aggregate({
      _sum: {
        amount: true,
      },
    });

    return NextResponse.json({ total: result._sum.amount || 0 });
  } catch (error) {
    console.error('Toplam bağış hesaplama hatası:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
