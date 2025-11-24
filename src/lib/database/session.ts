import 'server-only';

import { JWTPayload, jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';
import { getCfEnv } from './d1db';

export function getSession() {
  const env = getCfEnv();
  const secretKey = env.SESSION_SECRET_KEY;
  const encodeKey = new TextEncoder().encode(secretKey);
  const algorithmHMAC = 'HS256';

  async function encrypt(payload: JWTPayload) {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: algorithmHMAC })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(encodeKey);
  }

  async function decrypt(session: string) {
    try {
      const { payload } = await jwtVerify(session, encodeKey, { algorithms: [algorithmHMAC] });
      return payload;
    } catch (error) {
      console.debug('Session expired or invalid', error);
      return null;
    }
  }

  async function createSession(userId: string, userRole: string) {
    const isProduction = env.ENVIRONMENT === 'production';
    const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    const session = await encrypt({ userId, userRole, expiresAt: expiresAt.toISOString() });
    const cookieStore = await cookies();

    cookieStore.set('session', session, {
      httpOnly: true,
      secure: isProduction,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });

    return session;
  }

  return {
    encrypt,
    decrypt,
    createSession,
  };
}
