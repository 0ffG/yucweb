import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  let userId: number | undefined;
  try {
    const body = await request.json();
    // userId hem string hem number olabilir, ayrıca null/undefined kontrolü
    if (body.userId === undefined || body.userId === null || body.userId === "") {
      return NextResponse.json({ error: "userId zorunludur" }, { status: 400 });
    }
    userId = Number(body.userId);
    if (!Number.isInteger(userId) || userId <= 0) {
      return NextResponse.json({ error: "Geçersiz userId" }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ error: "Geçersiz istek formatı" }, { status: 400 });
  }

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
