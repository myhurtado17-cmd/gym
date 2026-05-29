import { prisma } from '@/lib/db';
import { startOfDay } from '@/lib/date';
import { decimalToNumber } from '@/lib/number';

export type NutritionTargets = {
  calories: number | null;
  proteinG: number | null;
  carbsG: number | null;
  fatG: number | null;
};

export async function getActiveNutritionTargets(userId: string): Promise<NutritionTargets> {
  const today = startOfDay(new Date());
  const goals = await prisma.goal.findMany({
    where: {
      userId,
      startsAt: { lte: today },
      OR: [{ endsAt: null }, { endsAt: { gte: today } }],
      type: { in: ['CALORIES', 'MACROS'] }
    },
    orderBy: { startsAt: 'desc' },
    select: { type: true, title: true, targetValue: true, unit: true }
  });

  const targets: NutritionTargets = { calories: null, proteinG: null, carbsG: null, fatG: null };

  for (const g of goals) {
    const v = decimalToNumber(g.targetValue);
    if (v == null) continue;

    if (g.type === 'CALORIES') {
      if (targets.calories == null) targets.calories = Math.round(v);
      continue;
    }

    // MACROS: use `unit` to specify which macro (P/C/F) in grams.
    // Accept common variants.
    const u = (g.unit ?? '').toLowerCase();
    if (u === 'protein' || u === 'p' || u === 'g_p' || u === 'g-protein') {
      if (targets.proteinG == null) targets.proteinG = Math.round(v);
    }
    if (u === 'carbs' || u === 'c' || u === 'g_c' || u === 'g-carbs') {
      if (targets.carbsG == null) targets.carbsG = Math.round(v);
    }
    if (u === 'fat' || u === 'f' || u === 'g_f' || u === 'g-fat') {
      if (targets.fatG == null) targets.fatG = Math.round(v);
    }
  }

  return targets;
}
