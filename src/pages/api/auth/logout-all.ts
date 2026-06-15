import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { clearSessionCookie } from '@/lib/auth/session';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/settings?error=csrf');
  }

  await prisma.session.deleteMany({
    where: { userId: session.user.id }
  });

  clearSessionCookie(cookies);
  return redirect('/login');
};
