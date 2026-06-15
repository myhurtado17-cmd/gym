import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  id: z.string().trim().min(1)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/exercises?error=csrf');
  }

  const parsed = schema.safeParse({ id: formData.get('id')?.toString() });
  if (!parsed.success) return redirect('/exercises?error=invalid');

  const { id } = parsed.data;

  const exercise = await prisma.exercise.findFirst({
    where: { id, userId: session.user.id }
  });
  if (!exercise) return redirect('/exercises?error=not_found');

  await prisma.exercise.delete({ where: { id } });

  return redirect('/exercises?deleted=1');
};
