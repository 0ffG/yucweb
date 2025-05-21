// 📁 app/api/donations/route.ts
import prisma  from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {// GET isteği ile bağışları alır (toplam bagis kac tl)
  // URL'den saat parametresini alır
  try {
    const { searchParams } = new URL(req.url);
    const hours = Number(searchParams.get("hours")) || 24; // default 24 saat

    const sinceDate = new Date(Date.now() - hours * 60 * 60 * 1000);

    const donations = await prisma.donation.findMany({
      where: {
        createdAt: {
          gte: sinceDate
        }
      },
      include: {
        donor: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(donations);
  } catch (err) {
    console.error("Donation get error:", err);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
