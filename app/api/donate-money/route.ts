import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth'; // 🔐 JWT'den userId almak için

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount } = body;

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Geçersiz bağış miktarı." }, { status: 400 });
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Giriş yapılmamış." }, { status: 403 });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "donor") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const userId = payload.userId;

  try {
    // Donor'un toplam bağış miktarını artır
    await prisma.user.update({
      where: { id: userId },
      data: {
        totalMoneyDonated: {
          increment: amount,
        },
      },
    });

    return NextResponse.json({ message: "Para yardımı başarıyla işlendi." });
  } catch (error) {
    console.error("Sunucu hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
