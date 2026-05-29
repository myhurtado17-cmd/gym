import { prisma } from '@/lib/db';

export async function recomputeNutritionDayTotals(nutritionDayId: string) {
  const entries = await prisma.nutritionEntry.findMany({
    where: { nutritionDayId },
    select: { calories: true, proteinG: true, carbsG: true, fatG: true }
  });

  const totals = entries.reduce(
    (acc, e) => {
      acc.calories += e.calories;
      acc.proteinG += e.proteinG;
      acc.carbsG += e.carbsG;
      acc.fatG += e.fatG;
      return acc;
    },
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  await prisma.nutritionDay.update({
    where: { id: nutritionDayId },
    data: totals
  });

  return totals;
}
