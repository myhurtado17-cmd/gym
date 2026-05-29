import { prisma } from '@/lib/db';
import { startOfDay } from '@/lib/date';
import { decimalToNumber } from '@/lib/number';

export async function listGoals(userId: string, limit = 50) {
  const rows = await prisma.goal.findMany({
    where: { userId },
    orderBy: { startsAt: 'desc' },
    take: limit,
    select: {
      id: true,
      type: true,
      title: true,
      targetValue: true,
      unit: true,
      startsAt: true,
      endsAt: true,
      createdAt: true
    }
  });

  return rows.map((g) => ({
    ...g,
    targetValue: decimalToNumber(g.targetValue)
  }));
}

export async function listActiveGoals(userId: string) {
  const today = startOfDay(new Date());
  const rows = await prisma.goal.findMany({
    where: {
      userId,
      startsAt: { lte: today },
      OR: [{ endsAt: null }, { endsAt: { gte: today } }]
    },
    orderBy: { startsAt: 'desc' },
    select: {
      id: true,
      type: true,
      title: true,
      targetValue: true,
      unit: true,
      startsAt: true,
      endsAt: true
    }
  });

  return rows.map((g) => ({
    ...g,
    targetValue: decimalToNumber(g.targetValue)
  }));
}
