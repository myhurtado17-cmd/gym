import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  itemId: z.string().trim().min(1),
  targetSets: z.coerce.number().int().min(0).optional(),
  targetReps: z.string().trim().optional().or(z.literal('')),
  notes: z.string().trim().optional().or(z.literal(''))
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/workouts?error=csrf');
  }

  const parsed = schema.safeParse({
    itemId: formData.get('itemId')?.toString(),
    targetSets: formData.get('targetSets')?.toString(),
    targetReps: formData.get('targetReps')?.toString(),
    notes: formData.get('notes')?.toString()
  });
  if (!parsed.success) return redirect('/workouts?error=invalid');

  const { itemId, targetSets, targetReps, notes } = parsed.data;

  const item = await prisma.workoutRoutineItem.findFirst({
    where: { id: itemId },
    include: { day: { select: { routine: { select: { userId: true } } } } }
  });
  if (!item || item.day.routine.userId !== session.user.id) {
    return redirect('/workouts?error=not_found');
  }

  await prisma.workoutRoutineItem.update({
    where: { id: itemId },
    data: {
      targetSets: targetSets ?? null,
      targetReps: targetReps || null,
      notes: notes || null
    }
  });

  return redirect(`/workouts/routines/${item.day.routineId}`);
};
