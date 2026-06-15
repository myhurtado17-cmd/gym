-- AlterTable: Add missing columns to WorkoutSession
ALTER TABLE "WorkoutSession" ADD COLUMN "completedAt" TIMESTAMP(3);
ALTER TABLE "WorkoutSession" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
