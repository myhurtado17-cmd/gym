import { prisma } from '@/lib/db';
import { startOfDay } from '@/lib/date';
import { decimalToNumber } from '@/lib/number';

export async function getLatestWeight(userId: string) {
  const latest = await prisma.bodyMetric.findFirst({
    where: { userId, weightKg: { not: null } },
    orderBy: { date: 'desc' },
    select: { date: true, weightKg: true }
  });

  return latest
    ? {
        date: latest.date,
        weightKg: decimalToNumber(latest.weightKg)
      }
    : null;
}

export async function getWeightSeries(userId: string, days: number) {
  const today = startOfDay(new Date());
  const from = new Date(today);
  from.setDate(from.getDate() - (days - 1));

  const rows = await prisma.bodyMetric.findMany({
    where: {
      userId,
      date: { gte: from, lte: today },
      weightKg: { not: null }
    },
    orderBy: { date: 'asc' },
    select: { date: true, weightKg: true }
  });

  return rows.map((r) => ({
    date: r.date,
    weightKg: decimalToNumber(r.weightKg)
  }));
}

export async function getTodayNutrition(userId: string) {
  const today = startOfDay(new Date());
  const day = await prisma.nutritionDay.findUnique({
    where: { userId_date: { userId, date: today } },
    select: { calories: true, proteinG: true, carbsG: true, fatG: true }
  });

  return (
    day ?? {
      calories: 0,
      proteinG: 0,
      carbsG: 0,
      fatG: 0
    }
  );
}

export async function getRecentWorkouts(userId: string, limit: number) {
  const sessions = await prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    select: {
      id: true,
      date: true,
      notes: true,
      routine: { select: { name: true } },
      day: { select: { name: true } },
      _count: { select: { setLogs: true } }
    }
  });

  return sessions.map((s) => ({
    id: s.id,
    date: s.date,
    routineName: s.routine?.name ?? null,
    dayName: s.day?.name ?? null,
    setCount: s._count.setLogs,
    notes: s.notes ?? null
  }));
}

export async function getActiveGoals(userId: string, limit: number) {
  const today = startOfDay(new Date());
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      startsAt: { lte: today },
      OR: [{ endsAt: null }, { endsAt: { gte: today } }]
    },
    orderBy: { startsAt: 'desc' },
    take: limit,
    select: { id: true, type: true, title: true, targetValue: true, unit: true, endsAt: true }
  });

  return goals.map((g) => ({
    id: g.id,
    type: g.type,
    title: g.title,
    targetValue: decimalToNumber(g.targetValue),
    unit: g.unit ?? null,
    endsAt: g.endsAt
  }));
}
