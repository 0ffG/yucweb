import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// PUT: Envanteri güncelle
export async function PUT(
  req: NextRequest,
  context: { params: { id: string; invId: string } }
) {
  const schoolId = parseInt(context.params.id);
  const invId = parseInt(context.params.invId);

  if (isNaN(schoolId) || isNaN(invId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const user = await getUserFromRequest(req);
  console.log("🔍 PUT user:", user, "schoolId:", schoolId);

  if (!user || user.role !== "school" || user.userId !== schoolId) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  const body = await req.json();
  const { item, count } = body;

  if (!item || typeof count !== "number" || count <= 0) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: invId },
    });

    if (!inventory || inventory.schoolId !== schoolId) {
      return NextResponse.json({ error: "Eşleşmeyen kayıt" }, { status: 403 });
    }

    const updated = await prisma.inventory.update({
      where: { id: invId },
      data: { item, count },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE: Envanteri sil
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string; invId: string } }
) {
  const { id, invId } = context.params;

  const schoolId = parseInt(id);
  const inventoryId = parseInt(invId);

  if (isNaN(schoolId) || isNaN(inventoryId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const user = await getUserFromRequest(req);
  console.log("🗑️ DELETE user:", user, "schoolId:", schoolId);

  if (!user || user.role !== "school" || user.userId !== schoolId) {
    return NextResponse.json({ error: "Yetkiniz yok" }, { status: 403 });
  }

  try {
    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
    });

    if (!inventory || inventory.schoolId !== schoolId) {
      return NextResponse.json({ error: "Yetkisiz işlem" }, { status: 403 });
    }

    await prisma.inventory.delete({ where: { id: inventoryId } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
