import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { parseISODate, startOfDay, toISODate } from '@/lib/date';
import { recomputeNutritionDayTotals } from '@/lib/nutrition/recompute';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  date: z.string().min(10).max(10),
  mealName: z.string().trim().min(1).max(80),
  calories: z.coerce.number().int().min(0).max(50_000),
  proteinG: z.coerce.number().int().min(0).max(5_000),
  carbsG: z.coerce.number().int().min(0).max(5_000),
  fatG: z.coerce.number().int().min(0).max(5_000),
  notes: z.string().trim().max(500).optional()
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/nutrition?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({
    date: form.get('date'),
    mealName: form.get('mealName'),
    calories: form.get('calories'),
    proteinG: form.get('proteinG'),
    carbsG: form.get('carbsG'),
    fatG: form.get('fatG'),
    notes: form.get('notes') ?? undefined
  });
  if (!parsed.success) return Response.redirect(new URL('/nutrition?error=invalid', request.url), 303);

  const date = parseISODate(parsed.data.date);
  if (!date) return Response.redirect(new URL('/nutrition?error=invalid_date', request.url), 303);

  const userId = session.user.id;
  const day = startOfDay(date);

  // Optional: link to a saved Meal row if it exists (no auto-create to avoid polluting list).
  const meal = await prisma.meal.findFirst({
    where: { userId, name: parsed.data.mealName },
    select: { id: true }
  });

  const nutritionDay = await prisma.nutritionDay.upsert({
    where: { userId_date: { userId, date: day } },
    create: { userId, date: day },
    update: {},
    select: { id: true }
  });

  await prisma.nutritionEntry.create({
    data: {
      nutritionDayId: nutritionDay.id,
      mealId: meal?.id ?? null,
      mealName: parsed.data.mealName,
      calories: parsed.data.calories,
      proteinG: parsed.data.proteinG,
      carbsG: parsed.data.carbsG,
      fatG: parsed.data.fatG,
      notes: parsed.data.notes?.trim() || null
    }
  });

  await recomputeNutritionDayTotals(nutritionDay.id);
  return Response.redirect(new URL(`/nutrition?date=${encodeURIComponent(toISODate(day))}`, request.url), 303);
};
