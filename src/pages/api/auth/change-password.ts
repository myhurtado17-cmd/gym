import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/auth/password';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  currentPassword: z.string().min(8).max(200),
  newPassword: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/settings?error=auth');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/settings?error=csrf');
  }

  const parsed = schema.safeParse({
    currentPassword: formData.get('currentPassword')?.toString(),
    newPassword: formData.get('newPassword')?.toString()
  });
  if (!parsed.success) return redirect('/settings?error=invalid');

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return redirect('/settings?error=auth');

  const ok = await verifyPassword(user.passwordHash, parsed.data.currentPassword);
  if (!ok) return redirect('/settings?error=wrong_password');

  const passwordHash = await hashPassword(parsed.data.newPassword);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash }
  });

  return redirect('/settings?updated=password');
};
