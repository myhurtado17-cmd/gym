import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';
import { getById } from '@/lib/workoutx/client';

const schema = z.object({
  exerciseId: z.string().trim().min(1),
  workoutxId: z.string().trim().min(1)
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
    workoutxId: formData.get('workoutxId')?.toString()
  });
  if (!parsed.success) return redirect('/exercises?error=invalid');

  const { exerciseId, workoutxId } = parsed.data;

  const exercise = await prisma.exercise.findFirst({
    where: { id: exerciseId, userId: session.user.id }
  });
  if (!exercise) return redirect('/exercises?error=not_found');

  let workoutxData;
  try {
    workoutxData = await getById(workoutxId);
  } catch {
    return redirect('/exercises?error=workoutx_not_found');
  }

  await prisma.exercise.update({
    where: { id: exerciseId },
    data: {
      gifUrl: workoutxData.gifUrl || null,
      instructions: workoutxData.instructions?.length ? JSON.stringify(workoutxData.instructions) : null,
      targetMuscle: workoutxData.target || null,
      secondaryMuscles: workoutxData.secondaryMuscles?.length ? JSON.stringify(workoutxData.secondaryMuscles) : null,
      workoutxId: workoutxData.id || null
    }
  });

  return redirect('/exercises?linked=1');
};
