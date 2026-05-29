import { prisma } from '@/lib/db';
import { startOfDay } from '@/lib/date';

export async function getNutritionDay(userId: string, date: Date) {
  const day = startOfDay(date);
  return prisma.nutritionDay.findUnique({
    where: { userId_date: { userId, date: day } },
    select: {
      id: true,
      date: true,
      calories: true,
      proteinG: true,
      carbsG: true,
      fatG: true,
      entries: {
        orderBy: { createdAt: 'asc' },
        select: {
          id: true,
          mealId: true,
          mealName: true,
          calories: true,
          proteinG: true,
          carbsG: true,
          fatG: true,
          notes: true,
          createdAt: true
        }
      }
    }
  });
}

export async function listNutritionDays(userId: string, limit = 14) {
  return prisma.nutritionDay.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    select: {
      id: true,
      date: true,
      calories: true,
      proteinG: true,
      carbsG: true,
      fatG: true,
      _count: { select: { entries: true } }
    }
  });
}
