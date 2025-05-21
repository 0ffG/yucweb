import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import  prisma  from "@/lib/prisma";
import { Role } from '@prisma/client';

interface RegisterBody {
  name: string;
  surname: string; // Gönderilen veri bu ama modelde 'lastName' olabilir
  email: string;
  password: string;
  role: string; // Türkçe ya da enum dışı olabilir
  photoUrl?: string;
}

// Türkçe roller geliyorsa eşlemek için
const roleMap: Record<string, Role> = {
  "Bağışçı": "donor",
  "Okul": "school",
  "Admin": "admin"
};

export async function POST(request: Request) {
  const { name, surname, email, password, role, photoUrl }: RegisterBody = await request.json();

  // Eksik alan kontrolü
  if (!name || !surname || !email || !password || !role) {
    return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
  }

  // Rol eşlemesi
  const mappedRole = roleMap[role] ?? (role as Role);
  if (!Object.values(Role).includes(mappedRole)) {
    return NextResponse.json({ error: 'Geçersiz kullanıcı rolü.' }, { status: 400 });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 salt round

    const user = await prisma.user.create({
      data: {
        name,
        lastName: surname, // Prisma modelinde lastName ise bunu kullan
        email,
        password: hashedPassword,
        role: mappedRole,
        photo: photoUrl || null
      }
    });

    return NextResponse.json({ message: 'Kayıt başarılı', user }, { status: 201 });
  } catch (error) {
    console.error("Kayıt hatası:", error);
    return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
  }
}
