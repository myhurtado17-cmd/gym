import type { APIRoute } from 'astro';
import { z } from 'zod';

import { requireApiSession } from '@/lib/auth/api';
import { prisma } from '@/lib/db';
import { parseISODate, startOfDay, toISODate } from '@/lib/date';
import { parseNutritionText } from '@/lib/nutrition/import';
import { recomputeNutritionDayTotals } from '@/lib/nutrition/recompute';
import { requireCsrf } from '@/lib/security/api';
import { CSRF_FIELD_NAME } from '@/lib/security/csrf';

const schema = z.object({
  date: z.string().min(10).max(10),
  text: z.string().trim().min(1).max(20_000)
});

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await requireApiSession(cookies);
  if (!session) return new Response('Unauthorized', { status: 401 });

  const form = await request.formData();
  if (!requireCsrf(cookies, form.get(CSRF_FIELD_NAME))) {
    return Response.redirect(new URL('/nutrition/import?error=invalid', request.url), 303);
  }
  const parsed = schema.safeParse({
    date: form.get('date'),
    text: form.get('text')
  });

  if (!parsed.success) {
    return Response.redirect(new URL('/nutrition/import?error=invalid', request.url), 303);
  }

  const date = parseISODate(parsed.data.date);
  if (!date) return Response.redirect(new URL('/nutrition/import?error=invalid_date', request.url), 303);

  const result = parseNutritionText(parsed.data.text);
  if (!result.entries.length) {
    return Response.redirect(new URL('/nutrition/import?error=no_entries', request.url), 303);
  }

  const userId = session.user.id;
  const day = startOfDay(date);

  const nutritionDay = await prisma.nutritionDay.upsert({
    where: { userId_date: { userId, date: day } },
    create: { userId, date: day },
    update: {},
    select: { id: true }
  });

  // Link to existing Meal rows when they exist.
  const mealNames = Array.from(new Set(result.entries.map((e) => e.mealName)));
  const meals = await prisma.meal.findMany({
    where: { userId, name: { in: mealNames } },
    select: { id: true, name: true }
  });
  const mealIdByName = new Map(meals.map((m) => [m.name.toLowerCase(), m.id] as const));

  await prisma.nutritionEntry.createMany({
    data: result.entries.map((e) => ({
      nutritionDayId: nutritionDay.id,
      mealId: mealIdByName.get(e.mealName.toLowerCase()) ?? null,
      mealName: e.mealName,
      calories: e.calories,
      proteinG: e.proteinG,
      carbsG: e.carbsG,
      fatG: e.fatG,
      notes: e.notes
    }))
  });

  await recomputeNutritionDayTotals(nutritionDay.id);
  return Response.redirect(new URL(`/nutrition?date=${encodeURIComponent(toISODate(day))}`, request.url), 303);
};
