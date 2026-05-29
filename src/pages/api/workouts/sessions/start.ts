import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { createWorkoutSession } from '@/lib/workouts/sessions';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  routineId: z.string().trim().min(1).optional(),
  dayId: z.string().trim().min(1).optional()
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/workouts?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({
    routineId: form.get('routineId') ?? undefined,
    dayId: form.get('dayId') ?? undefined
  });
  if (!parsed.success) return Response.redirect(new URL('/workouts?error=invalid', request.url), 303);

  const userId = session.user.id;
  const { routineId, dayId } = parsed.data;

  if (routineId) {
    const ok = await prisma.workoutRoutine.findFirst({
      where: { id: routineId, userId },
      select: { id: true }
    });
    if (!ok) return new Response('Not found', { status: 404 });
  }

  if (dayId) {
    const ok = await prisma.workoutDay.findFirst({
      where: { id: dayId, routine: { userId } },
      select: { id: true, routineId: true }
    });
    if (!ok) return new Response('Not found', { status: 404 });
  }

  const created = await createWorkoutSession({
    userId,
    routineId: routineId ?? null,
    dayId: dayId ?? null
  });

  return Response.redirect(new URL(`/workouts/sessions/${created.id}`, request.url), 303);
};
