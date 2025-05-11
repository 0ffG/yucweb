import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  const { name, surname, email, password, role, photoUrl } = await request.json();

  const hashedPassword = await bcrypt.hash(password, 10);  // 10 tuzlama (salt rounds)

  const user = await prisma.user.create({
    data: {
      name,
      surname,
      email,
      password: hashedPassword,  // Artık hashlenmiş
      role,
      photo: photoUrl
    }
  });

  return NextResponse.json({ message: 'Kayıt başarılı', user });
}
