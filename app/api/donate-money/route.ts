import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const amountRaw = body.amount;
    const amount = Number(amountRaw);

    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: "Geçersiz bağış miktarı." }, { status: 400 });
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Giriş yapılmamış." }, { status: 403 });
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Token doğrulanamadı." }, { status: 403 });
    }

    if (!payload || payload.role !== "donor") {
      return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
    }

    const userId = payload.userId;

    // 1️⃣ moneyDonation tablosuna kayıt ekle
    await prisma.moneyDonation.create({
      data: {
        donorId: userId,
        amount: amount,
      },
    });

    // 2️⃣ Kullanıcının toplam bağışını güncelle
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
