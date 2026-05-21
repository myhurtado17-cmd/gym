import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { getSessionFromRequest } from '@/lib/auth/session';

export async function requireUser(Astro: { cookies: any; redirect: (path: string) => Response }) {
  const token = Astro.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return Astro.redirect('/login');

  const session = await getSessionFromRequest(token);
  if (!session) return Astro.redirect('/login');

  return session.user;
}
