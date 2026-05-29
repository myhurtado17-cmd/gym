import prismaPkg from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';

type PrismaClientConstructor = new (...args: any[]) => PrismaClientType;

const PrismaClientCtor = (prismaPkg as unknown as { PrismaClient: PrismaClientConstructor }).PrismaClient;

function createPrismaClient() {
  const datasourceUrl = process.env.DATABASE_URL;
  if (!datasourceUrl) {
    // Fail fast with a clear message in serverless environments.
    throw new Error('DATABASE_URL is missing. Set it in your environment variables (Vercel Project Settings).');
  }

  // Override the primary datasource URL at runtime.
  return new PrismaClientCtor({
    datasources: {
      db: { url: datasourceUrl }
    }
  });
}

declare global {
  var __prisma: PrismaClientType | undefined;
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma;
