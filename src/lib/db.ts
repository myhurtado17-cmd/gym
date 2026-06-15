import prismaPkg from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';

type PrismaClientConstructor = new (...args: any[]) => PrismaClientType;

const PrismaClientCtor = (prismaPkg as unknown as {
  PrismaClient: PrismaClientConstructor;
}).PrismaClient;

declare global {
  var __prisma: PrismaClientType | undefined;
}

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is missing (set it in Vercel Environment Variables).');
  }

  return new PrismaClientCtor({
    datasourceUrl: url
  });
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
