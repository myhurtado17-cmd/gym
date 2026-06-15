import type { APIRoute } from 'astro';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  name: z.string().trim().max(80).optional().or(z.literal('')),
  heightCm: z.coerce.number().int().min(50).max(300).optional().or(z.literal('').transform(() => undefined)),
  age: z.coerce.number().int().min(10).max(150).optional().or(z.literal('').transform(() => undefined))
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const session = await requireApiSession(cookies);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  if (!requireCsrf(cookies, formData.get(CSRF_FIELD_NAME))) {
    return redirect('/settings?error=csrf');
  }

  const parsed = schema.safeParse({
    name: formData.get('name')?.toString(),
    heightCm: formData.get('heightCm')?.toString(),
    age: formData.get('age')?.toString()
  });
  if (!parsed.success) return redirect('/settings?error=invalid');

  const userId = session.user.id;
  const { name, heightCm, age } = parsed.data;

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { name: name || null }
    }),
    prisma.userProfile.upsert({
      where: { userId },
      create: { userId, heightCm: heightCm ?? null, age: age ?? null },
      update: { heightCm: heightCm ?? null, age: age ?? null }
    })
  ]);

  return redirect('/settings?updated=profile');
};
