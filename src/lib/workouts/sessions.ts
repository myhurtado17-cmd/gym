import { prisma } from '@/lib/db';

export async function createWorkoutSession(params: {
  userId: string;
  routineId?: string | null;
  dayId?: string | null;
  date?: Date;
  notes?: string | null;
}) {
  const { userId, routineId = null, dayId = null, date = new Date(), notes = null } = params;
  return prisma.workoutSession.create({
    data: {
      userId,
      routineId,
      dayId,
      date,
      notes
    },
    select: { id: true }
  });
}

export async function getWorkoutSession(userId: string, sessionId: string) {
  return prisma.workoutSession.findFirst({
    where: { id: sessionId, userId },
    select: {
      id: true,
      date: true,
      notes: true,
      completedAt: true,
      routine: { select: { id: true, name: true } },
      day: {
        select: {
          id: true,
          name: true,
          items: {
            orderBy: { sortOrder: 'asc' },
            select: {
              id: true,
              sortOrder: true,
              targetSets: true,
              targetReps: true,
              notes: true,
              exercise: { select: { id: true, name: true } }
            }
          }
        }
      },
      setLogs: {
        orderBy: [{ exerciseId: 'asc' }, { setNumber: 'asc' }],
        select: {
          id: true,
          exerciseId: true,
          exercise: { select: { id: true, name: true } },
          setNumber: true,
          reps: true,
          weightKg: true,
          rpe: true,
          notes: true
        }
      }
    }
  });
}

export async function listRecentSessions(userId: string, limit = 10) {
  return prisma.workoutSession.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    select: {
      id: true,
      date: true,
      routine: { select: { name: true } },
      day: { select: { name: true } },
      _count: { select: { setLogs: true } }
    }
  });
}
