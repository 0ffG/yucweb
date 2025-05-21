// app/api/needs/route.ts

import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const item = searchParams.get("item");

  if (!item) {
    return NextResponse.json([], { status: 200 });
  }

  try {
    const needs = await prisma.inventory.findMany({
      where: {
        item: {
          contains: item,
          mode: "insensitive",
        },
      },
      include: {
        school: true, // ilişkili okul bilgisi lazım
      },
    });

    // Frontend'in beklediği formatta döndür
    const response = needs.map(n => ({
      school: n.school.name,
      item: n.item,
      count: n.count,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error("Hata /api/needs:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
