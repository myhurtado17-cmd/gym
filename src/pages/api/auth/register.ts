import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie } from '@/lib/auth/session';

const RegisterSchema = z.object({
  name: z.string().trim().min(1).max(80).optional().or(z.literal('')),
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(200)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  const parsed = RegisterSchema.safeParse({
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString()
  });

  if (!parsed.success) return redirect(`/register?error=${encodeURIComponent('Invalid input')}`);

  const email = parsed.data.email.toLowerCase();
  const name = parsed.data.name?.trim() ? parsed.data.name.trim() : null;

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return redirect(`/register?error=${encodeURIComponent('Email already in use')}`);

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      profile: { create: {} }
    }
  });

  const session = await createSession(user.id);
  setSessionCookie(cookies, session.token, session.expiresAt);

  return redirect('/dashboard');
};
