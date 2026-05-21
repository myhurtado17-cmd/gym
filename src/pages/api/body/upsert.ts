import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { getSessionFromRequest } from '@/lib/auth/session';
import { parseISODate } from '@/lib/date';

const schema = z.object({
  date: z.string().min(10).max(10),
  weightKg: z.string().trim().optional(),
  bodyFatPct: z.string().trim().optional(),
  armsCm: z.string().trim().optional(),
  chestCm: z.string().trim().optional(),
  waistCm: z.string().trim().optional(),
  legsCm: z.string().trim().optional(),
  notes: z.string().trim().max(500).optional()
});

function parseNullableDecimal(s: string | undefined) {
  const v = (s ?? '').trim();
  if (!v) return null;
  const n = Number(v);
  if (!Number.isFinite(n)) return null;
  return n;
}

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return redirect('/login');
  const session = await getSessionFromRequest(token);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  const parsed = schema.safeParse({
    date: formData.get('date')?.toString(),
    weightKg: formData.get('weightKg')?.toString(),
    bodyFatPct: formData.get('bodyFatPct')?.toString(),
    armsCm: formData.get('armsCm')?.toString(),
    chestCm: formData.get('chestCm')?.toString(),
    waistCm: formData.get('waistCm')?.toString(),
    legsCm: formData.get('legsCm')?.toString(),
    notes: formData.get('notes')?.toString()
  });

  if (!parsed.success) return redirect(`/body?error=${encodeURIComponent('Invalid input')}`);

  const date = parseISODate(parsed.data.date);
  if (!date) return redirect(`/body?error=${encodeURIComponent('Invalid date')}`);

  await prisma.bodyMetric.upsert({
    where: { userId_date: { userId: session.userId, date } },
    create: {
      userId: session.userId,
      date,
      weightKg: parseNullableDecimal(parsed.data.weightKg),
      bodyFatPct: parseNullableDecimal(parsed.data.bodyFatPct),
      armsCm: parseNullableDecimal(parsed.data.armsCm),
      chestCm: parseNullableDecimal(parsed.data.chestCm),
      waistCm: parseNullableDecimal(parsed.data.waistCm),
      legsCm: parseNullableDecimal(parsed.data.legsCm),
      notes: parsed.data.notes?.trim() || null
    },
    update: {
      weightKg: parseNullableDecimal(parsed.data.weightKg),
      bodyFatPct: parseNullableDecimal(parsed.data.bodyFatPct),
      armsCm: parseNullableDecimal(parsed.data.armsCm),
      chestCm: parseNullableDecimal(parsed.data.chestCm),
      waistCm: parseNullableDecimal(parsed.data.waistCm),
      legsCm: parseNullableDecimal(parsed.data.legsCm),
      notes: parsed.data.notes?.trim() || null
    }
  });

  return redirect('/body');
};
