import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  exerciseId: z.string().trim().min(1),
  routineId: z.string().trim().optional().or(z.literal('')),
  newRoutineName: z.string().trim().min(1).max(80).optional().or(z.literal('')),
  dayId: z.string().trim().optional().or(z.literal('')),
  newDayName: z.string().trim().min(1).max(80).optional().or(z.literal('')),
  targetSets: z.coerce.number().int().min(0).optional(),
  targetReps: z.string().trim().optional().or(z.literal(''))
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/exercises?error=csrf');
  }

  const parsed = schema.safeParse({
    exerciseId: formData.get('exerciseId')?.toString(),
    routineId: formData.get('routineId')?.toString(),
    newRoutineName: formData.get('newRoutineName')?.toString(),
    dayId: formData.get('dayId')?.toString(),
    newDayName: formData.get('newDayName')?.toString(),
    targetSets: formData.get('targetSets')?.toString(),
    targetReps: formData.get('targetReps')?.toString()
  });
  if (!parsed.success) return redirect('/exercises?error=invalid');

  const { exerciseId, routineId, newRoutineName, dayId, newDayName, targetSets, targetReps } = parsed.data;
  const userId = session.user.id;

  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, userId }
  });
  if (!exercise) return redirect('/exercises?error=not_found');

  // Create new routine or use existing
  let targetRoutineId = routineId;
  let targetDayId = dayId;

  if (newRoutineName) {
    const routine = await prisma.workoutRoutine.create({
      data: {
        userId,
        name: newRoutineName,
        days: {
          create: {
            name: newDayName || 'Día 1',
            sortOrder: 0
          }
        }
      },
      include: { days: { take: 1 } }
    });
    targetRoutineId = routine.id;
    targetDayId = routine.days[0].id;
  }

  if (!targetRoutineId || !targetDayId) {
    return redirect('/exercises?error=invalid');
  }

  // Get max sortOrder for the day
  const maxItem = await prisma.workoutRoutineItem.findFirst({
    where: { dayId: targetDayId },
    orderBy: { sortOrder: 'desc' },
    select: { sortOrder: true }
  });

  await prisma.workoutRoutineItem.create({
    data: {
      dayId: targetDayId,
      exerciseId,
      sortOrder: (maxItem?.sortOrder ?? -1) + 1,
      targetSets: targetSets ?? null,
      targetReps: targetReps || null
    }
  });

  return redirect(`/workouts/routines/${targetRoutineId}`);
};
