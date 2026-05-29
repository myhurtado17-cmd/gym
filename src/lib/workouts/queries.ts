import { prisma } from '@/lib/db';

export async function listRoutines(userId: string) {
  return prisma.workoutRoutine.findMany({
    where: { userId },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      name: true,
      visibility: true,
      updatedAt: true,
      _count: { select: { days: true } }
    }
  });
}

export async function getRoutine(userId: string, routineId: string) {
  return prisma.workoutRoutine.findFirst({
    where: { id: routineId, userId },
    select: {
      id: true,
      name: true,
      notes: true,
      visibility: true,
      createdAt: true,
      updatedAt: true,
      days: {
        orderBy: { sortOrder: 'asc' },
        select: {
          id: true,
          name: true,
          sortOrder: true,
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
      }
    }
  });
}
