-- AlterTable: Add WorkoutX enrichment fields to Exercise
ALTER TABLE "Exercise" ADD COLUMN "gifUrl" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "instructions" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "targetMuscle" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "secondaryMuscles" TEXT;
ALTER TABLE "Exercise" ADD COLUMN "workoutxId" TEXT;
