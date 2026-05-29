import { randomBytes, timingSafeEqual, createHash } from 'node:crypto';
import type { AstroCookies } from 'astro';

const CSRF_COOKIE = 'gym_csrf';

function base64Url(buf: Buffer) {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

export function ensureCsrfCookie(cookies: AstroCookies) {
  const existing = cookies.get(CSRF_COOKIE)?.value;
  if (existing) return existing;
  const token = base64Url(randomBytes(32));
  cookies.set(CSRF_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: import.meta.env.PROD,
    path: '/',
    maxAge: 60 * 60 * 24 * 30 // 30 days
  });
  return token;
}

// Double-submit cookie: form sends a hash derived from cookie.
export function getCsrfFormValue(cookieToken: string) {
  return createHash('sha256').update(cookieToken).digest('hex');
}

export function verifyCsrf(cookies: AstroCookies, formValue: string | null) {
  const cookieToken = cookies.get(CSRF_COOKIE)?.value;
  if (!cookieToken) return false;
  if (!formValue) return false;
  const expected = getCsrfFormValue(cookieToken);
  const a = Buffer.from(expected);
  const b = Buffer.from(String(formValue));
  // avoid throwing on different lengths
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const CSRF_FIELD_NAME = 'csrf';
