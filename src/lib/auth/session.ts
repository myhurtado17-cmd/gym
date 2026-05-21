import { randomBytes } from 'node:crypto';
import type { AstroCookies } from 'astro';

import { prisma } from '@/lib/db';
import { SESSION_COOKIE_NAME, SESSION_TTL_SECONDS } from '@/lib/auth/constants';

function base64Url(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function createSessionToken() {
  return base64Url(randomBytes(32));
}

export async function createSession(userId: string) {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_SECONDS * 1000);

  await prisma.session.create({
    data: { userId, token, expiresAt }
  });

  return { token, expiresAt };
}

export async function invalidateSession(token: string) {
  await prisma.session.delete({ where: { token } }).catch(() => {
    // ignore missing
  });
}

export async function getSessionFromRequest(token: string) {
  const now = new Date();
  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: { include: { profile: true } } }
  });

  if (!session) return null;
  if (session.expiresAt <= now) {
    await prisma.session.delete({ where: { token } }).catch(() => {});
    return null;
  }
  return session;
}

export function setSessionCookie(cookies: AstroCookies, token: string, expiresAt: Date) {
  cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    expires: expiresAt
  });
}

export function clearSessionCookie(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
}
