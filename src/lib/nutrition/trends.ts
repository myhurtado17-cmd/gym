import { prisma } from '@/lib/db';
import { startOfDay } from '@/lib/date';

export async function getCaloriesSeries(userId: string, days: number) {
  const today = startOfDay(new Date());
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));

  const rows = await prisma.nutritionDay.findMany({
    where: { userId, date: { gte: from, lte: today } },
    orderBy: { date: 'asc' },
    select: { date: true, calories: true }
  });

  return rows.map((r) => ({ date: r.date, calories: r.calories }));
}
