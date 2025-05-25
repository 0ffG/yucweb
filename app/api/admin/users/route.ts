// Dosya Yolu: app/api/admin/users/route.ts
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; // auth.ts dosyanızın lib klasöründe olduğunu varsayıyoruz
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Yetkisiz. Giriş yapınız." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz erişim. Admin rolü gereklidir." }, { status: 403 });
  }

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastName: true,
        email: true,
        photo: true,
        role: true,
      },
      orderBy: {
        id: 'asc',
      }
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Kullanıcılar getirilirken bir hata oluştu." }, { status: 500 });
  }
}