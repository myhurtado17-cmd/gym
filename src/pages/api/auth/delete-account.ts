import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  password: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/settings?error=csrf');
  }

  const parsed = schema.safeParse({ password: formData.get('password')?.toString() });
  if (!parsed.success) return redirect('/settings?error=invalid');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return redirect('/settings?error=auth');

  const ok = await verifyPassword(user.passwordHash, parsed.data.password);
  if (!ok) return redirect('/settings?error=wrong_password');

  await prisma.user.delete({ where: { id: user.id } });

  return redirect('/login?deleted=1');
};
