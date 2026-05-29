import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  sessionId: z.string().trim().min(1),
  exerciseId: z.string().trim().min(1),
  setNumber: z.coerce.number().int().min(1).max(50)
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
    exerciseId: form.get('exerciseId'),
    setNumber: form.get('setNumber')
  });
  if (!parsed.success) return new Response('Invalid', { status: 400 });

  const userId = session.user.id;
  const { sessionId, exerciseId, setNumber } = parsed.data;

  const sessionRow = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, completedAt: true }
  });
  if (!sessionRow) return new Response('Not found', { status: 404 });
  if (sessionRow.completedAt) {
    return Response.redirect(new URL(`/workouts/sessions/${sessionId}?error=${encodeURIComponent('Session completed')}`, request.url), 303);
  }

  // Ensure exercise belongs to user.
  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, userId },
    select: { id: true }
  });
  if (!exercise) return new Response('Not found', { status: 404 });

  await prisma.workoutSetLog.deleteMany({ where: { sessionId, exerciseId, setNumber } });
  return Response.redirect(new URL(`/workouts/sessions/${sessionId}`, request.url), 303);
};
