import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

// Create connection pool for better serverless performance
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Prevent multiple Prisma instances in development (helps with hot reloading)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ 
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
