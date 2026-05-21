import type { APIRoute } from 'astro';
import { z } from 'zod';

import { prisma } from '@/lib/db';
import { SESSION_COOKIE_NAME } from '@/lib/auth/constants';
import { getSessionFromRequest } from '@/lib/auth/session';
import { parseISODate } from '@/lib/date';

const schema = z.object({
  date: z.string().min(10).max(10)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const token = cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return redirect('/login');
  const session = await getSessionFromRequest(token);
  if (!session) return redirect('/login');

  const formData = await request.formData();
  const parsed = schema.safeParse({ date: formData.get('date')?.toString() });
  if (!parsed.success) return redirect('/body');

  const date = parseISODate(parsed.data.date);
  if (!date) return redirect('/body');

  await prisma.bodyMetric
    .delete({ where: { userId_date: { userId: session.userId, date } } })
    .catch(() => {});

  return redirect('/body');
};
