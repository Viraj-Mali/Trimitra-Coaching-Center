import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

export interface JWTPayload {
  id: string;
  name: string;
  mobile: string;
  role: 'FREE' | 'ENROLLED' | 'ADMIN';
  track: string;
  rollNumber: string;
}

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET environment variable is not set');
  return new TextEncoder().encode(secret);
};

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function getCurrentStudent(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('trimitra_session')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export const COOKIE_NAME = 'trimitra_session';

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: '/',
};
