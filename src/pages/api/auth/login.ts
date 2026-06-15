import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, invalidateSession, setSessionCookie } from '@/lib/auth/session';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';
import { getClientIp, rateLimit } from '@/lib/security/rateLimit';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';

const LoginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect(`/login?error=${encodeURIComponent('Sesión inválida')}`);
  }
  const parsed = LoginSchema.safeParse({
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString()
  });

  if (!parsed.success) return redirect(`/login?error=${encodeURIComponent('Correo o contraseña inválidos')}`);

  const email = parsed.data.email.toLowerCase();

  const ip = getClientIp(request);
  const limit = rateLimit({ key: `login:${ip}:${email}`, windowMs: 60_000, max: 10 });
  if (!limit.allowed) {
    return redirect(`/login?error=${encodeURIComponent('Demasiados intentos. Intenta de nuevo en un minuto.')}`);
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return redirect(`/login?error=${encodeURIComponent('Correo o contraseña inválidos')}`);

  const ok = await verifyPassword(user.passwordHash, parsed.data.password);
  if (!ok) return redirect(`/login?error=${encodeURIComponent('Correo o contraseña inválidos')}`);

  // Invalidate any existing session to reduce session fixation risk.
  const existingToken = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (existingToken) await invalidateSession(existingToken);

  const session = await createSession(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);

  return redirect('/dashboard');
};
