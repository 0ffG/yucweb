import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getUserFromRequest(req);
  const schoolId = parseInt(params.id);

  console.log("✅ Token'dan gelen kullanıcı:", user);
  console.log("📌 Params id:", schoolId);

  if (!user || user.role !== "school" || user.userId !== schoolId) {
    return NextResponse.json({ error: "Bu işlemi yapma yetkiniz yok" }, { status: 403 });
  }

  const body = await req.json();
  const { item, amount } = body;

  if (!item || typeof amount !== "number" || amount <= 0) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  try {
    const newInventory = await prisma.inventory.create({
      data: {
        schoolId,
        item,
        amount,
      },
    });

    return NextResponse.json(newInventory, { status: 201 });
  } catch (error) {
    console.error("Ekleme hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
