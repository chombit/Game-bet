require('dotenv').config();
import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';
console.log('🔌 [DB] Initialize with URL:', databaseUrl);

const adapter = new PrismaLibSql({
  url: databaseUrl,
});

export const prisma = new PrismaClient({
  adapter,
});
