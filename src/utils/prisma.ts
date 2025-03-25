import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

// Validate critical env vars (Vercel-specific)
if (process.env.VERCEL && !process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required for Vercel deployment');
}

export const prisma = (() => {
  if (process.env.VERCEL_ENV === 'edge') {
    throw new Error('Prisma is not supported on Edge Runtime');
  }

  const client = process.env.NODE_ENV === 'production'
    ? new PrismaClient()
    : global.prisma || (global.prisma = new PrismaClient());

  // Cold start optimization for Vercel
  if (process.env.VERCEL) {
    client.$connect().catch((e) => {
      console.error('Prisma Vercel connection error:', e);
      process.exit(1);
    });
  }

  return client;
})();

// Graceful shutdown (Vercel Serverless compatible)
if (process.env.VERCEL) {
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}