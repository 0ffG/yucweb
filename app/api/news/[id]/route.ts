import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // prisma.ts dosyanızın yolunu güncelleyin

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const newsId = parseInt(params.id, 10);
    if (isNaN(newsId)) {
      return NextResponse.json({ message: "Geçersiz haber ID" }, { status: 400 });
    }

    await prisma.news.delete({
      where: { id: newsId },
    });
    return NextResponse.json({ message: "Haber silindi" }, { status: 200 });
  } catch (error) {
    console.error("Haber silinemedi:", error);
    // Prisma P2025: Kayıt bulunamadı hatası
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ message: "Silinecek haber bulunamadı" }, { status: 404 });
    }
    return NextResponse.json({ message: "Sunucu hatası", error: (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}