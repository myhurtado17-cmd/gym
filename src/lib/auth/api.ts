import type { AstroCookies } from 'astro';

import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function requireApiSession(cookies: AstroCookies) {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return getSessionFromRequest(token);
}
