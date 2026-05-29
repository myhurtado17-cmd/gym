import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  id: z.string().trim().min(1)
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/goals?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({ id: form.get('id') });
  if (!parsed.success) return Response.redirect(new URL('/goals?error=invalid', request.url), 303);

  const userId = session.user.id;
  const goal = await prisma.goal.findFirst({
    where: { id: parsed.data.id, userId },
    select: { id: true }
  });
  if (!goal) return new Response('Not found', { status: 404 });

  await prisma.goal.delete({ where: { id: goal.id } });
  return Response.redirect(new URL('/goals', request.url), 303);
};
