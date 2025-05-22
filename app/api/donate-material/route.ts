import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { schoolName, itemName, count } = body;

  if (!schoolName || !itemName || !count || count <= 0) {
    return NextResponse.json({ error: "Eksik veya geçersiz veri." }, { status: 400 });
  }

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Giriş yapılmamış." }, { status: 403 });
  }

  let user: { userId: number; role: string } | null;
  try {
    user = verifyToken(token);
    if (!user) {
      return NextResponse.json({ error: "Token doğrulanamadı." }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Token doğrulanamadı." }, { status: 403 });
  }

  if (user.role !== "donor") {
    return NextResponse.json({ error: "Sadece bağışçılar işlem yapabilir." }, { status: 403 });
  }

  try {
    const school = await prisma.user.findFirst({
      where: {
        name: schoolName,
        role: "school",
      },
    });

    if (!school) {
      return NextResponse.json({ error: "Okul bulunamadı." }, { status: 404 });
    }

    const inventory = await prisma.inventory.findFirst({
      where: {
        schoolId: school.id,
        item: itemName,
      },
    });

    if (!inventory) {
      return NextResponse.json({ error: "Bu ürün okulun ihtiyacında yok." }, { status: 404 });
    }

    if (inventory.count < count) {
      return NextResponse.json({ error: "Bağış miktarı ihtiyaçtan fazla olamaz." }, { status: 400 });
    }

    // 1️⃣ İhtiyaç sayısını düşür
    await prisma.inventory.update({
      where: { id: inventory.id },
      data: {
        count: { decrement: count },
      },
    });

    // 2️⃣ MaterialDonation tablosuna bağışı kaydet
    await prisma.materialDonation.create({
      data: {
        userId: user.userId,
        schoolId: school.id,
      },
    });

    return NextResponse.json({ message: "Bağış başarıyla kaydedildi." });
  } catch (error) {
    console.error("❌ Sunucu hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası." }, { status: 500 });
  }
}
