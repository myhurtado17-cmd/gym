import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { recomputeNutritionDayTotals } from '@/lib/nutrition/recompute';
import { toISODate } from '@/lib/date';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  entryId: z.string().trim().min(1)
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/nutrition?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({ entryId: form.get('entryId') });
  if (!parsed.success) return Response.redirect(new URL('/nutrition?error=invalid', request.url), 303);

  const userId = session.user.id;

  const entry = await prisma.nutritionEntry.findFirst({
    where: { id: parsed.data.entryId, day: { userId } },
    select: { id: true, nutritionDayId: true, day: { select: { date: true } } }
  });
  if (!entry) return new Response('Not found', { status: 404 });

  await prisma.nutritionEntry.delete({ where: { id: entry.id } });
  await recomputeNutritionDayTotals(entry.nutritionDayId);

  return Response.redirect(new URL(`/nutrition?date=${encodeURIComponent(toISODate(entry.day.date))}`, request.url), 303);
};
