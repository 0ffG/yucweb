// Предполагаемый путь: app/api/user/[id]/route.ts
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const requestedId = parseInt(id);
  if (isNaN(requestedId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Yetkisiz. Giriş yapınız." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Yetkisiz. Geçersiz token." }, { status: 403 });
  }

  // Yetkilendirme mantığı: Admin tüm profilleri görebilir,
  // donor rolündeki kullanıcı sadece kendi profilini görebilir.
  const isOwner = payload.userId === requestedId && payload.role === "donor";
  const isAdmin = payload.role === "admin";

  if (!isOwner && !isAdmin) {
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

// Mevcut DELETE veya diğer metodlar varsa burada yer alabilir.
// Kullanıcı silme işlemi için DELETE metodunun da bu dosyada veya
// app/api/user/[id]/route.ts altında olması beklenir.
// Örnek:

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const requestedId = parseInt(id);
  if (isNaN(requestedId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Yetkisiz. Giriş yapınız." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    // Sadece adminlerin kullanıcı silebildiğini varsayıyoruz
    return NextResponse.json({ error: "Yetkisiz erişim. Kullanıcı silme işlemi için Admin rolü gereklidir." }, { status: 403 });
  }

  try {
    await prisma.user.delete({
      where: { id: requestedId },
    });
    return NextResponse.json({ message: "Kullanıcı başarıyla silindi." }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Kullanıcı silinirken bir hata oluştu." }, { status: 500 });
  }
}
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const requestedId = parseInt(id);
  if (isNaN(requestedId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Yetkisiz. Giriş yapınız." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Yetkisiz. Geçersiz token." }, { status: 403 });
  }
  // Sadece kendi profilini güncelleyebilsin veya admin ise
  const isOwner = payload.userId === requestedId && payload.role === "donor";
  const isAdmin = payload.role === "admin";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Yetkisiz erişim." }, { status: 403 });
  }

  const body = await req.json();
  try {
    const updatedUser = await prisma.user.update({
      where: { id: requestedId },
      data: {
        name: body.name,
        lastName: body.lastName,
        photo: body.photo,
      },
    });
    return NextResponse.json({ message: "Kullanıcı güncellendi.", user: updatedUser }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Güncelleme sırasında hata oluştu." }, { status: 500 });
  }
}