import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const requestedId = parseInt(params.id);
  if (isNaN(requestedId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Yetkisiz. Giriş yapınız." }, { status: 403 });
  }

  const payload = verifyToken(token);
  if (!payload || payload.userId !== requestedId || payload.role !== "donor") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: requestedId },
    include: {
      materialSent: {
        include: {
          school: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      moneyDonations: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  // 💰 Toplam para bağışı hesaplama
  const totalMoneyDonated = user.moneyDonations.reduce((sum, donation) => sum + donation.amount, 0);

  return NextResponse.json({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    email: user.email,
    role: user.role,
    photo: user.photo,
    totalMoneyDonated,
    materialDonations: user.materialSent.map((donation) => ({
      schoolId: donation.school?.id,
      schoolName: donation.school?.name ?? "Bilinmeyen Okul",
      item: donation.item,
      amount: donation.amount,
      createdAt: donation.createdAt,
    })),
  });
}
