import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  sessionId: z.string().trim().min(1),
  notes: z.string().trim().max(2000).optional()
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return new Response('Invalid', { status: 400 });
  }
  const parsed = schema.safeParse({
    sessionId: form.get('sessionId'),
    notes: form.get('notes')?.toString() ?? undefined
  });
  if (!parsed.success) return new Response('Invalid', { status: 400 });

  const userId = session.user.id;
  const { sessionId, notes } = parsed.data;

  const row = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, completedAt: true }
  });
  if (!row) return new Response('Not found', { status: 404 });

  if (!row.completedAt) {
    await prisma.workoutSession.update({
      where: { id: sessionId },
      data: {
        ...(notes != null ? { notes: notes.trim() || null } : {}),
        completedAt: new Date()
      }
    });
  }

  return Response.redirect(new URL('/workouts', request.url), 303);
};
