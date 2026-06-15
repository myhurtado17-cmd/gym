import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  routineId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(80)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/workouts?error=csrf');
  }

  const parsed = schema.safeParse({
    routineId: formData.get('routineId')?.toString(),
    name: formData.get('name')?.toString()
  });
  if (!parsed.success) return redirect('/workouts?error=invalid');

  const { routineId, name } = parsed.data;

  const routine = await prisma.workoutRoutine.findFirst({
    where: { id: routineId, userId: session.user.id }
  });
  if (!routine) return redirect('/workouts?error=not_found');

  await prisma.workoutRoutine.update({
    where: { id: routineId },
    data: { name }
  });

  return redirect(`/workouts/routines/${routineId}`);
};
