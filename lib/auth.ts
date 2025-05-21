import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// Token içeriği tip tanımı
export type TokenPayload = {
  userId: number;
  role: 'admin' | 'donor' | 'school';
};

// JWT oluştur
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

// JWT çözümle (tip garantili)
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, SECRET);
    if (typeof decoded === 'string' || !decoded) return null;

    const { userId, role } = decoded as TokenPayload;
    return { userId, role };
  } catch (err) {
    return null;
  }
}
// İstekten kullanıcı bilgilerini al
export async function getUserFromRequest(req: Request): Promise<TokenPayload | null> {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split(";")
    .find((c) => c.trim().startsWith("token="))
    ?.split("=")[1];

  if (!token) return null;

  return verifyToken(token);
}
