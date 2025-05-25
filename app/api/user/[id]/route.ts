import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // prisma.ts dosyanızın yolunu güncelleyin

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Geçersiz kullanıcı ID" }, { status: 400 });
    }

    // Burada kullanıcıya bağlı diğer kayıtların durumu düşünülmelidir.
    // Örneğin, bir kullanıcının bağışları varsa ne olacak?
    // Prisma şemanızdaki onDelete kuralları bu durumu yönetebilir.
    // Veya burada ek kontroller/işlemler yapmanız gerekebilir.

    // Örnek: Önce kullanıcıya bağlı MoneyDistribution kayıtlarını silmek gerekebilir.
    // Bu, şemanızdaki onDelete cascade tanımlı değilse manuel yapılmalıdır.
    // await prisma.moneyDistribution.deleteMany({ where: { schoolId: userId } });
    // await prisma.materialDonation.deleteMany({ where: { donorId: userId } });
    // await prisma.materialDonation.deleteMany({ where: { schoolId: userId } });
    // await prisma.moneyDonation.deleteMany({ where: { donorId: userId } });
    // await prisma.inventory.deleteMany({ where: { schoolId: userId } });


    await prisma.user.delete({
      where: { id: userId },
    });
    return NextResponse.json({ message: "Kullanıcı silindi" }, { status: 200 });
  } catch (error) {
    console.error("Kullanıcı silinemedi:", error);
    if (typeof error === 'object' && error !== null && 'code' in error) {
      const err = error as { code?: string; message?: string };
      if (err.code === 'P2025') { // Prisma: Kayıt bulunamadı
        return NextResponse.json({ message: "Silinecek kullanıcı bulunamadı" }, { status: 404 });
      }
      // P2003: Foreign key constraint failed on the field: `...`
      // Bu hata, silinmeye çalışılan kullanıcının başka tablolarda referansları olduğu anlamına gelir.
      // Bu durumda, önce bağlı kayıtları silmeniz veya `onDelete` kurallarını şemanızda ayarlamanız gerekir.
      if (err.code === 'P2003') {
        return NextResponse.json({ message: "Kullanıcı silinemedi. Kullanıcıya bağlı kayıtlar (bağışlar, envanter vb.) bulunuyor." }, { status: 409 }); // 409 Conflict
      }
      return NextResponse.json({ message: "Sunucu hatası", error: err.message }, { status: 500 });
    }
    return NextResponse.json({ message: "Sunucu hatası", error: String(error) }, { status: 500 });
  }
}

