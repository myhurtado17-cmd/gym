import type { APIRoute } from 'astro';

import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { clearSessionCookie, invalidateSession } from '@/lib/auth/session';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/login');
  }
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (token) await invalidateSession(token);
  clearSessionCookie(cookies);
  return redirect('/login');
};
