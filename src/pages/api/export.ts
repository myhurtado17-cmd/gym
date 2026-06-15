import type { APIRoute } from 'astro';
import { prisma } from '@/lib/db';
import { requireApiSession } from '@/lib/auth/api';
import { toISODate } from '@/lib/date';

export const GET: APIRoute = async ({ cookies, url }) => {
  const session = await requireApiSession(cookies);
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const type = url.searchParams.get('type') ?? 'all';
  const userId = session.user.id;
  const rows: string[] = [];

  if (type === 'workouts' || type === 'all') {
    rows.push('=== ENTRENOS ===');
    rows.push('Fecha,Rutina,Día,Ejercicio,kg,Reps,RPE');

    const sessions = await prisma.workoutSession.findMany({
      where: { userId },
      include: {
        routine: { select: { name: true } },
        day: { select: { name: true } },
        setLogs: { include: { exercise: { select: { name: true } } } }
      },
      orderBy: { date: 'desc' }
    });

    for (const s of sessions) {
      const date = toISODate(s.date);
      const routine = s.routine?.name ?? '';
      const day = s.day?.name ?? '';
      for (const log of s.setLogs) {
        rows.push(`${date},${routine},${day},${log.exercise.name},${log.weightKg ?? ''},${log.reps ?? ''},${log.rpe ?? ''}`);
      }
    }
  }

  if (type === 'nutrition' || type === 'all') {
    rows.push('');
    rows.push('=== NUTRICIÓN ===');
    rows.push('Fecha,Comida,Calorías,Proteína,Carbos,Grasa');

    const entries = await prisma.nutritionEntry.findMany({
      where: { day: { userId } },
      include: { day: { select: { date: true } } },
      orderBy: { createdAt: 'desc' }
    });

    for (const e of entries) {
      rows.push(`${toISODate(e.day.date)},${e.mealName},${e.calories},${e.proteinG},${e.carbsG},${e.fatG}`);
    }
  }

  if (type === 'body' || type === 'all') {
    rows.push('');
    rows.push('=== CUERPO ===');
    rows.push('Fecha,Peso kg,Grasa %,Brazo cm,Pecho cm,Cintura cm,Pierna cm');

    const metrics = await prisma.bodyMetric.findMany({
      where: { userId },
      orderBy: { date: 'desc' }
    });

    for (const m of metrics) {
      rows.push(`${toISODate(m.date)},${m.weightKg ?? ''},${m.bodyFatPct ?? ''},${m.armsCm ?? ''},${m.chestCm ?? ''},${m.waistCm ?? ''},${m.legsCm ?? ''}`);
    }
  }

  const csv = rows.join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="gymtracker-export-${new Date().toISOString().slice(0, 10)}.csv"`
    }
  });
};
