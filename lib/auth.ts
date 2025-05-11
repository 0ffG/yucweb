import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET as string;

if (!SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

export function generateToken(payload: object) {
  return jwt.sign(payload, SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (err) {
    return null;
  }
}