import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'enat-bet-jwt-secret-2026-change-in-production';
const JWT_EXPIRES = '7d';

export interface JWTPayload {
  userId: number;
  phone: string;
}

export function signToken(userId: number, phone: string): string {
  return jwt.sign({ userId, phone }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}
