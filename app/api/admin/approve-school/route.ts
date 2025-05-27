import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { userId } = await request.json();

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { adminApproved: true }
    });

    return NextResponse.json({ message: "Okul onaylandı", user });
  } catch (error) {
    console.error("Admin onay hatası:", error);
    return NextResponse.json({ error: "Bir hata oluştu" }, { status: 500 });
  }
}
