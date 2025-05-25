import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // prisma.ts dosyanızın yolunu güncelleyin

export async function POST(request: Request) {
  try {
    const { amount, schoolId, moneyDonationId } = await request.json();

    if (amount == null || schoolId == null) {
      return NextResponse.json({ message: "Miktar ve Okul ID gerekli" }, { status: 400 });
    }
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ message: "Geçersiz miktar" }, { status: 400 });
    }
    if (typeof schoolId !== 'number') {
      return NextResponse.json({ message: "Geçersiz Okul ID" }, { status: 400 });
    }
    if (moneyDonationId != null && typeof moneyDonationId !== 'number') {
      return NextResponse.json({ message: "Geçersiz Bağış ID" }, { status: 400 });
    }

    // Okulun var olup olmadığını kontrol et
    const school = await prisma.user.findUnique({
      where: { id: schoolId, role: 'school' } // Rolü okul olan bir kullanıcı olmalı
    });
    if (!school) {
      return NextResponse.json({ message: "Okul bulunamadı veya rolü uygun değil" }, { status: 404 });
    }

    // Eğer moneyDonationId verilmişse, o bağışın var olup olmadığını kontrol et
    if (moneyDonationId) {
      const moneyDonation = await prisma.moneyDonation.findUnique({
        where: { id: moneyDonationId }
      });
      if (!moneyDonation) {
        return NextResponse.json({ message: "Belirtilen para bağışı bulunamadı" }, { status: 404 });
      }
    }

    const distribution = await prisma.moneyDistribution.create({
      data: {
        amount: Number(amount),
        schoolId: Number(schoolId),
        moneyDonationId: moneyDonationId ? Number(moneyDonationId) : null,
      },
    });

    // İsteğe bağlı: Okulun toplam aldığı bağış miktarını User modelinde güncelleyebilirsiniz
    // await prisma.user.update({
    //   where: { id: Number(schoolId) },
    //   data: {
    //     // Eğer User modelinde böyle bir alanınız varsa:
    //     // totalMoneyReceived: { increment: Number(amount) }
    //   }
    // });

    return NextResponse.json(distribution, { status: 201 });
  } catch (error) {
    console.error("Para dağıtılamadı:", error);
    const errorMessage = typeof error === "object" && error !== null && "message" in error
      ? (error as { message: string }).message
      : String(error);
    return NextResponse.json({ message: "Sunucu hatası", error: errorMessage }, { status: 500 });
  }
}