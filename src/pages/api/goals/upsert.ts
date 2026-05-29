import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { parseISODate, startOfDay, toISODate } from '@/lib/date';
import type { Prisma } from '@prisma/client';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  id: z.string().trim().min(1).optional(),
  type: z.enum(['WEIGHT', 'BODY_FAT', 'CALORIES', 'MACROS', 'STRENGTH']),
  title: z.string().trim().min(1).max(80),
  targetValue: z.string().trim().optional(),
  unit: z.string().trim().max(32).optional(),
  startsAt: z.string().min(10).max(10),
  endsAt: z.string().trim().optional()
});

function parseNullableDecimalString(s: string | undefined) {
  const v = (s ?? '').trim();
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n as unknown as Prisma.Decimal;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/goals?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({
    id: form.get('id')?.toString() || undefined,
    type: form.get('type')?.toString(),
    title: form.get('title')?.toString(),
    targetValue: form.get('targetValue')?.toString(),
    unit: form.get('unit')?.toString() || undefined,
    startsAt: form.get('startsAt')?.toString(),
    endsAt: form.get('endsAt')?.toString()
  });

  if (!parsed.success) {
    return Response.redirect(new URL('/goals?error=invalid', request.url), 303);
  }

  const userId = session.user.id;
  const startsAt = parseISODate(parsed.data.startsAt);
  if (!startsAt) return Response.redirect(new URL('/goals?error=invalid_start', request.url), 303);

  const endsAt = parsed.data.endsAt ? parseISODate(parsed.data.endsAt) : null;
  if (parsed.data.endsAt && !endsAt) return Response.redirect(new URL('/goals?error=invalid_end', request.url), 303);

  const data = {
    userId,
    type: parsed.data.type,
    title: parsed.data.title,
    targetValue: parseNullableDecimalString(parsed.data.targetValue),
    unit: parsed.data.unit?.trim() || null,
    startsAt: startOfDay(startsAt),
    endsAt: endsAt ? startOfDay(endsAt) : null
  };

  if (parsed.data.id) {
    const existing = await prisma.goal.findFirst({
      where: { id: parsed.data.id, userId },
      select: { id: true }
    });
    if (!existing) return new Response('Not found', { status: 404 });

    await prisma.goal.update({
      where: { id: parsed.data.id },
      data
    });
  } else {
    await prisma.goal.create({ data });
  }

  return Response.redirect(new URL(`/goals?startsAt=${encodeURIComponent(toISODate(data.startsAt))}`, request.url), 303);
};
