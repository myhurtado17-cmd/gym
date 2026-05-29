import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  sessionId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(80)
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
    name: form.get('name')
  });
  if (!parsed.success) return new Response('Invalid', { status: 400 });

  const userId = session.user.id;
  const { sessionId, name } = parsed.data;

  const sessionRow = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, completedAt: true, dayId: true }
  });
  if (!sessionRow) return new Response('Not found', { status: 404 });
  if (sessionRow.completedAt) {
    return Response.redirect(new URL(`/workouts/sessions/${sessionId}?error=${encodeURIComponent('Session completed')}`, request.url), 303);
  }
  if (sessionRow.dayId) {
    return Response.redirect(new URL(`/workouts/sessions/${sessionId}?error=${encodeURIComponent('Session is tied to a routine day')}`, request.url), 303);
  }

  // Ensure exercise exists for the user.
  const exercise = await prisma.exercise.upsert({
    where: { userId_name: { userId, name } },
    create: { userId, name },
    update: {},
    select: { id: true }
  });

  // Ensure at least Set 1 exists so it shows up.
  await prisma.workoutSetLog.upsert({
    where: { sessionId_exerciseId_setNumber: { sessionId, exerciseId: exercise.id, setNumber: 1 } },
    create: { sessionId, exerciseId: exercise.id, setNumber: 1 },
    update: {}
  });

  return Response.redirect(new URL(`/workouts/sessions/${sessionId}`, request.url), 303);
};
