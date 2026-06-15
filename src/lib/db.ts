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
  return new PrismaClientCtor();
}

export const prisma = globalThis.__prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.__prisma = prisma;
}
