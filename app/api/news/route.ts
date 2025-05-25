import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // prisma.ts dosyanızın yolunu güncelleyin

export async function GET() {
  try {
    const newsList = await prisma.news.findMany({
      orderBy: {
        id: 'desc', // Veya createdAt alanınız varsa ona göre sıralama yapabilirsiniz
      },
    });
    return NextResponse.json(newsList);
  } catch (error) {
    console.error("Haberler çekilemedi:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Sunucu hatası", error: errorMessage }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, image } = await request.json();
    if (!title) {
      return NextResponse.json({ message: "Haber başlığı gerekli" }, { status: 400 });
    }

    const newNews = await prisma.news.create({
      data: {
        title,
        image, // image boş veya null olabilir (opsiyonel)
      },
    });
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error("Haber eklenemedi:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: "Sunucu hatası", error: errorMessage }, { status: 500 });
  }
}