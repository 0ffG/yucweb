import { NextRequest, NextResponse } from "next/server";
import prisma  from "@/lib/prisma";

export async function GET() {
  try {
    const allNews = await prisma.news.findMany();
    return NextResponse.json(allNews);
  } catch (error) {
    console.error("Haberler çekilemedi:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { title, image } = body;

  if (!title || typeof title !== "string") {
    return NextResponse.json({ error: "Başlık gerekli" }, { status: 400 });
  }

  try {
    const newNews = await prisma.news.create({
      data: {
        title,
        image: image || null,
      },
    });
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Haber eklenemedi:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
