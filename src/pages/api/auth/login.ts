import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie } from '@/lib/auth/session';

const LoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const parsed = LoginSchema.safeParse({
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString()
  });

  if (!parsed.success) return redirect(`/login?error=${encodeURIComponent('Invalid email or password')}`);

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return redirect(`/login?error=${encodeURIComponent('Invalid email or password')}`);

  const ok = await verifyPassword(user.passwordHash, parsed.data.password);
  if (!ok) return redirect(`/login?error=${encodeURIComponent('Invalid email or password')}`);

  const session = await createSession(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);

  return redirect('/dashboard');
};
