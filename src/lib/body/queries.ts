import { prisma } from '@/lib/db';
import { startOfDay } from '@/lib/date';
import { decimalToNumber } from '@/lib/number';

export async function listBodyMetrics(userId: string, limit: number) {
  const rows = await prisma.bodyMetric.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    select: {
      date: true,
      weightKg: true,
      bodyFatPct: true,
      armsCm: true,
      chestCm: true,
      waistCm: true,
      legsCm: true,
      notes: true
    }
  });
  return rows.map((r) => ({
    date: r.date,
    weightKg: decimalToNumber(r.weightKg),
    bodyFatPct: decimalToNumber(r.bodyFatPct),
    armsCm: decimalToNumber(r.armsCm),
    chestCm: decimalToNumber(r.chestCm),
    waistCm: decimalToNumber(r.waistCm),
    legsCm: decimalToNumber(r.legsCm),
    notes: r.notes ?? null
  }));
}

export async function getBodyMetricByDate(userId: string, date: Date) {
  const row = await prisma.bodyMetric.findUnique({
    where: { userId_date: { userId, date } },
    select: {
      date: true,
      weightKg: true,
      bodyFatPct: true,
      armsCm: true,
      chestCm: true,
      waistCm: true,
      legsCm: true,
      notes: true
    }
  });
  if (!row) return null;
  return {
    date: row.date,
    weightKg: decimalToNumber(row.weightKg),
    bodyFatPct: decimalToNumber(row.bodyFatPct),
    armsCm: decimalToNumber(row.armsCm),
    chestCm: decimalToNumber(row.chestCm),
    waistCm: decimalToNumber(row.waistCm),
    legsCm: decimalToNumber(row.legsCm),
    notes: row.notes ?? null
  };
}

export async function getBodyWeightSeries(userId: string, days: number) {
  const today = startOfDay(new Date());
  const from = new Date(today);
  from.setUTCDate(from.getUTCDate() - (days - 1));

  const rows = await prisma.bodyMetric.findMany({
    where: {
      userId,
      date: { gte: from, lte: today },
      weightKg: { not: null }
    },
    orderBy: { date: 'asc' },
    select: { date: true, weightKg: true }
  });

  return rows.map((r) => ({ date: r.date, weightKg: decimalToNumber(r.weightKg) }));
}
