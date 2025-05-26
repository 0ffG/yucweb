import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { sendVerificationEmail } from '@/lib/email';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  const { subject, message } = await request.json();
  if (!subject || !message) {
    return NextResponse.json({ error: 'Konu ve mesaj zorunludur.' }, { status: 400 });
  }

  // Tüm kullanıcıların e-posta adreslerini al
  const users = await prisma.user.findMany({ select: { email: true } });
  const emails = users.map(u => u.email);

  // Mail gönderici ayarları (lib/email.ts ile aynı yapı)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Her kullanıcıya mail gönder
  for (const to of emails) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: `<p>${message}</p>`
    });
  }

  return NextResponse.json({ message: 'Tüm kullanıcılara e-posta gönderildi.' });
}
