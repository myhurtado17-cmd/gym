import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { createSession, invalidateSession, setSessionCookie } from '@/lib/auth/session';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';
import { getClientIp, rateLimit } from '@/lib/security/rateLimit';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';

const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(80).optional().or(z.literal('')),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect(`/register?error=${encodeURIComponent('Sesión inválida')}`);
  }
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString()
  });

  if (!parsed.success) return redirect(`/register?error=${encodeURIComponent('Datos inválidos')}`);

  const email = parsed.data.email.toLowerCase();
  const name = parsed.data.name?.trim() ? parsed.data.name.trim() : null;

  const ip = getClientIp(request);
  const limit = rateLimit({ key: `register:${ip}`, windowMs: 60_000, max: 5 });
  if (!limit.allowed) {
    return redirect(`/register?error=${encodeURIComponent('Demasiados intentos. Intenta de nuevo en un minuto.')}`);
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return redirect(`/register?error=${encodeURIComponent('Correo ya registrado')}`);

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      profile: { create: {} }
    }
  });

  const existingToken = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (existingToken) await invalidateSession(existingToken);

  const session = await createSession(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);

  return redirect('/dashboard');
};
