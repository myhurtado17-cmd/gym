import { defineMiddleware } from 'astro/middleware';

import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { getSessionFromRequest } from '@/lib/auth/session';

const PROTECTED_PREFIXES = ['/dashboard', '/workouts', '/nutrition', '/body', '/goals', '/settings'];

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, locals, redirect } = context;

  const isProtected = PROTECTED_PREFIXES.some((p) => url.pathname === p || url.pathname.startsWith(p + '/'));
  if (!isProtected) return next();

  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return redirect('/login');

  const session = await getSessionFromRequest(token);
  if (!session) return redirect('/login');

  locals.user = {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    imageUrl: session.user.imageUrl
  };

  return next();
});
