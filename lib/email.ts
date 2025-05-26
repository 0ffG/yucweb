import nodemailer from 'nodemailer';

export async function sendVerificationEmail(to: string, token: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // veya kendi SMTP servisinizi girin
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'E-posta Doğrulama',
    html: `<p>Hesabınızı doğrulamak için <a href="${verificationUrl}">buraya tıklayın</a>.</p>`
  });
}
