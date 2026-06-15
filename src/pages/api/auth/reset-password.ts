import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/reset-password?error=invalid');
  }
  const parsed = schema.safeParse({
    token: formData.get('token')?.toString(),
    password: formData.get('password')?.toString()
  });
  if (!parsed.success) return redirect('/reset-password?error=invalid');

  const { token, password } = parsed.data;

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true }
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return redirect('/reset-password?error=expired');
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { passwordHash }
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() }
    }),
    prisma.session.deleteMany({
      where: { userId: resetToken.userId }
    })
  ]);

  return redirect('/login?reset=1');
};
