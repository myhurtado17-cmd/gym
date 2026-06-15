import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';
import { getClientIp, rateLimit } from '@/lib/security/rateLimit';

const schema = z.object({
  email: z.string().trim().email().max(255)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/forgot-password?error=invalid');
  }
  const parsed = schema.safeParse({ email: formData.get('email')?.toString() });
  if (!parsed.success) return redirect('/forgot-password?error=invalid');

  const ip = getClientIp(request);
  const limit = rateLimit({ key: `forgot:${ip}`, windowMs: 60_000, max: 3 });
  if (!limit.allowed) {
    return redirect('/forgot-password?error=rate_limit');
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + 3600_000)
      }
    });
    return redirect(`/reset-password?token=${token}`);
  }

  return redirect('/forgot-password?sent=1');
};
