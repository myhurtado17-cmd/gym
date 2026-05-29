import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { parseRoutineText } from '@/lib/workouts/import';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  name: z.string().trim().min(1).max(80),
  text: z.string().trim().min(1).max(20_000)
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/workouts/import?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({
    name: form.get('name'),
    text: form.get('text')
  });

  if (!parsed.success) {
    return Response.redirect(new URL('/workouts/import?error=invalid', request.url), 303);
  }

  const routine = parseRoutineText(parsed.data.name, parsed.data.text);
  const userId = session.user.id;

  const exerciseNames = Array.from(
    new Set(
      routine.days.flatMap((d) => d.items.map((i) => i.exerciseName)).filter(Boolean)
    )
  );

  // Create missing exercises for this user.
  await prisma.exercise.createMany({
    data: exerciseNames.map((name) => ({ userId, name })),
    skipDuplicates: true
  });

  const exerciseRows = await prisma.exercise.findMany({
    where: { userId, name: { in: exerciseNames } },
    select: { id: true, name: true }
  });
  const exerciseIdByName = new Map(exerciseRows.map((e) => [e.name.toLowerCase(), e.id] as const));

  const created = await prisma.workoutRoutine.create({
    data: {
      userId,
      name: routine.name,
      days: {
        create: routine.days.map((d, dayIdx) => ({
          name: d.name,
          sortOrder: dayIdx,
          items: {
            create: d.items.reduce<
              {
                sortOrder: number;
                exerciseId: string;
                targetSets: number | null;
                targetReps: string | null;
                notes: string | null;
              }[]
            >((acc, it, idx) => {
              const exerciseId = exerciseIdByName.get(it.exerciseName.toLowerCase());
              if (!exerciseId) return acc;
              acc.push({
                sortOrder: idx,
                exerciseId,
                targetSets: it.targetSets,
                targetReps: it.targetReps,
                notes: it.notes
              });
              return acc;
            }, [])
          }
        }))
      }
    },
    select: { id: true }
  });

  return Response.redirect(new URL(`/workouts/routines/${created.id}`, request.url), 303);
};
