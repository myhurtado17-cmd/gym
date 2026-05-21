import type { APIRoute } from 'astro';

import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { clearSessionCookie, invalidateSession } from '@/lib/auth/session';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) await invalidateSession(token);
  clearSessionCookie(cookies);
  return redirect('/login');
};
