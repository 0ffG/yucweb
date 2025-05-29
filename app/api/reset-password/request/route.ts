import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "E-posta sistemde kayıtlı değil." }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 1000 * 60 * 30); // 30 dk geçerli

  await prisma.user.update({
    where: { email },
    data: {
      resetToken: token,
      resetTokenExpiry: expiry,
    },
  });

  // TODO: E-posta gönderimi burada yapılmalı
  console.log(`Şifre sıfırlama bağlantısı: https://yucweb.vercel.app/reset-password/${token}`);

  return NextResponse.json({ message: "Sıfırlama bağlantısı e-posta adresinize gönderildi." });
}
