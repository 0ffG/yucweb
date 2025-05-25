import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  const schoolId = parseInt(id);

  if (isNaN(schoolId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  try {
    const school = await prisma.user.findUnique({
      where: {
        id: schoolId,
        role: "school",
      },
      select: {
        id: true,
        name: true,
        email: true,
        location:true, // yeni alan eklendi
        inventories: {
          select: {
            id:true,
            item: true,
            amount: true,
          },
        },
      },
    });

    if (!school) {
      return NextResponse.json({ error: "Okul bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({
      id: school.id,
      name: school.name,
      email: school.email,
      location: school.location, // yeni alan eklendi
      needs: school.inventories.map((inv) => ({
        id: inv.id,
        name: inv.item,
        quantity: inv.amount,
      })),
    });
  } catch (error) {
    console.error("Hata:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const schoolId = parseInt(id);

  if (isNaN(schoolId)) {
    return NextResponse.json({ error: "Geçersiz ID" }, { status: 400 });
  }

  const body = await req.json();
  const { name, email, location } = body;

  try {
    const updatedSchool = await prisma.user.update({
      where: {
        id: schoolId,
        role: "school",
      },
      data: {
        name,
        email,
        location,
      },
    });

    return NextResponse.json(updatedSchool);
  } catch (error) {
    console.error("PUT /api/schools/[id] hata:", error);
    return NextResponse.json({ error: "Güncelleme başarısız" }, { status: 500 });
  }
}