import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // prisma.ts dosyanızın yolunu güncelleyin
import { NextRequest } from 'next/server'; // NextRequest'i import edin

export async function GET(request: NextRequest) { // Request tipini NextRequest olarak değiştirin
  try {
    const { searchParams } = new URL(request.url);
    const hoursParam = searchParams.get("hours");

    let dateFilter = {};
    if (hoursParam) {
      const hours = parseInt(hoursParam, 10);
      if (!isNaN(hours) && hours > 0) {
        const startDate = new Date();
        startDate.setHours(startDate.getHours() - hours);
        dateFilter = { createdAt: { gte: startDate } };
      }
    }

    const materialDonations = await prisma.materialDonation.findMany({
      where: {
        ...dateFilter, // Oluşturulan tarih filtresini burada kullanın
      },
      include: {
        donor: {
          select: {
            name: true,
            lastName: true,
          },
        },
        school: {
          select: {
            name: true, 
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(materialDonations.map(d => ({
      ...d,
      donor: {
        name: `${d.donor.name || ''}${d.donor.lastName ? ' ' + d.donor.lastName : ''}`.trim() || 'Bilinmeyen Bağışçı'
      },
      school: { // Okul null olabilir, kontrol ekleyin
        name: d.school?.name || 'Bilinmeyen Okul'
      }
    })));
  } catch (error) {
    console.error("Eşya bağışları çekilemedi (backend):", error);
    const errorMessage = error instanceof Error ? error.message : "Bilinmeyen sunucu hatası";
    return NextResponse.json({ message: "Sunucu hatası", error: errorMessage }, { status: 500 });
  }
}