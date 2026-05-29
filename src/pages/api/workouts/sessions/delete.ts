import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  sessionId: z.string().trim().min(1)
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return new Response('Invalid', { status: 400 });
  }
  const parsed = schema.safeParse({ sessionId: form.get('sessionId') });
  if (!parsed.success) return new Response('Invalid', { status: 400 });

  const userId = session.user.id;
  const { sessionId } = parsed.data;

  const row = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true }
  });
  if (!row) return new Response('Not found', { status: 404 });

  await prisma.workoutSession.delete({ where: { id: sessionId } });
  return Response.redirect(new URL('/workouts', request.url), 303);
};
