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

  let payload;
  try {
    payload = verifyToken(token); // { userId, role }
  } catch (err) {
    return NextResponse.json({ error: "Token geçersiz." }, { status: 403 });
  }

  if (payload.userId !== requestedId || payload.role !== "donor") {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const user = await prisma.user.findUnique({
    where: { id: requestedId },
    include: {
      materialDonationsSent: {
        include: {
          school: {
            select: {
              id: true,
              name: true, // ✅ sadece adını alıyoruz
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    name: user.name,
    lastName: user.lastName,
    role: user.role,
    totalMoneyDonated: user.totalMoneyDonated,
    totalSaplingsDonated: user.totalSaplingsDonated,
    materialDonations: user.materialDonationsSent.map((donation) => ({
      schoolName: donation.school?.name ?? "Bilinmeyen Okul",
    })),
  });
}
