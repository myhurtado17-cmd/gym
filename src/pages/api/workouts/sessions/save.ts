import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { Prisma } from '@prisma/client';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  sessionId: z.string().trim().min(1),
  exerciseId: z.string().trim().min(1),
  setNumber: z.coerce.number().int().min(1).max(50),
  reps: z.coerce.number().int().min(0).max(500).nullable().optional(),
  weightKg: z.coerce.number().min(0).max(2000).nullable().optional(),
  rpe: z.coerce.number().min(0).max(10).nullable().optional(),
  notes: z.string().trim().max(500).nullable().optional()
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) return new Response('Invalid', { status: 400 });
  const parsed = schema.safeParse({
    sessionId: form.get('sessionId'),
    exerciseId: form.get('exerciseId'),
    setNumber: form.get('setNumber'),
    reps: form.get('reps') === '' ? null : form.get('reps'),
    weightKg: form.get('weightKg') === '' ? null : form.get('weightKg'),
    rpe: form.get('rpe') === '' ? null : form.get('rpe'),
    notes: form.get('notes') === '' ? null : form.get('notes')
  });

  if (!parsed.success) return new Response('Invalid', { status: 400 });

  const userId = session.user.id;
  const { sessionId, exerciseId, setNumber, reps, weightKg, rpe, notes } = parsed.data;

  const sessionRow = await prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: { id: true, completedAt: true, dayId: true }
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

  // If the session is tied to a day, only allow exercises from that day.
  if (sessionRow.dayId) {
    const ok = await prisma.workoutRoutineItem.findFirst({
      where: { dayId: sessionRow.dayId, exerciseId },
      select: { id: true }
    });
    if (!ok) {
      return Response.redirect(
        new URL(`/workouts/sessions/${sessionId}?error=${encodeURIComponent('Exercise not in this day')}`, request.url),
        303
      );
    }
  }

  await prisma.workoutSetLog.upsert({
    where: { sessionId_exerciseId_setNumber: { sessionId, exerciseId, setNumber } },
    create: {
      sessionId,
      exerciseId,
      setNumber,
      reps: reps ?? null,
      weightKg: weightKg == null ? null : new Prisma.Decimal(weightKg),
      rpe: rpe == null ? null : new Prisma.Decimal(rpe),
      notes: notes ?? null
    },
    update: {
      reps: reps ?? null,
      weightKg: weightKg == null ? null : new Prisma.Decimal(weightKg),
      rpe: rpe == null ? null : new Prisma.Decimal(rpe),
      notes: notes ?? null
    }
  });

  return Response.redirect(new URL(`/workouts/sessions/${sessionId}`, request.url), 303);
};
