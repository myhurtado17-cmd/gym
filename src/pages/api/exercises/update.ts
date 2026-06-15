import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  id: z.string().trim().min(1),
  name: z.string().trim().min(1).max(80),
  muscle: z.string().trim().max(80).optional().or(z.literal('')),
  equipment: z.string().trim().max(80).optional().or(z.literal(''))
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/exercises?error=csrf');
  }

  const parsed = schema.safeParse({
    id: formData.get('id')?.toString(),
    name: formData.get('name')?.toString(),
    muscle: formData.get('muscle')?.toString(),
    equipment: formData.get('equipment')?.toString()
  });
  if (!parsed.success) return redirect('/exercises?error=invalid');

  const { id, name, muscle, equipment } = parsed.data;

  const exercise = await prisma.exercise.findFirst({
    where: { id, userId: session.user.id }
  });
  if (!exercise) return redirect('/exercises?error=not_found');

  await prisma.exercise.update({
    where: { id },
    data: {
      name,
      muscle: muscle || null,
      equipment: equipment || null
    }
  });

  return redirect('/exercises?updated=1');
};
