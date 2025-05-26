import bcrypt from "bcryptjs";
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { Role } from '@prisma/client';
import { sendVerificationEmail } from "@/lib/email";
import crypto from "crypto";

interface RegisterBody {
  name: string;
  surname?: string;
  email: string;
  password: string;
  role: string;
  photoUrl?: string;
  location?: string;
}

const roleMap: Record<string, Role> = {
  "Bağışçı": "donor",
  "Okul": "school",
  "Admin": "admin"
};

export async function POST(request: Request) {
  const body: RegisterBody = await request.json();
  const {
    name,
    surname,
    email,
    password,
    role,
    photoUrl,
    location
  } = body;

  // Rol eşlemesi
  const mappedRole = roleMap[role] ?? (role as Role);
  if (!Object.values(Role).includes(mappedRole)) {
    return NextResponse.json({ error: 'Geçersiz kullanıcı rolü.' }, { status: 400 });
  }

  // Ortak zorunlu alanlar
  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'Tüm alanlar zorunludur.' }, { status: 400 });
  }

  // Rol bazlı zorunlu alanlar
  if (mappedRole === "donor" && !surname) {
    return NextResponse.json({ error: 'Soyad zorunludur.' }, { status: 400 });
  }
  if (mappedRole === "school" && !location) {
    return NextResponse.json({ error: 'Okul adresi (location) zorunludur.' }, { status: 400 });
  }

  try {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });//checking for existing user

  if (existingUser) {
    return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanılıyor.' }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Doğrulama token'ı oluştur
  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await prisma.user.create({
    data: {
      name,
      lastName: mappedRole === "donor" ? surname! : '',
      location: mappedRole === "school" ? location! : null,
      email,
      password: hashedPassword,
      role: mappedRole,
      photo: photoUrl?.trim() || null,
      verificationToken,
      emailVerified: false
    }
  });

  // Doğrulama e-postası gönder
  await sendVerificationEmail(email, verificationToken);

  return NextResponse.json({ message: 'Kayıt başarılı, lütfen e-postanızı doğrulayın.', user }, { status: 201 });
} catch (error) {
  console.error("Kayıt hatası:", error);
  return NextResponse.json({ error: 'Sunucu hatası.' }, { status: 500 });
}

}