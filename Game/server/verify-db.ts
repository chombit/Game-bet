import { prisma } from './src/db';

async function verify() {
  try {
    console.log('Testing connection...');
    const userCount = await prisma.user.count();
    console.log('✅ Connected! User count:', userCount);
    const betCount = await prisma.bet.count();
    console.log('✅ Connected! Bet count:', betCount);
  } catch (err) {
    console.error('❌ Connection FAILED:', err);
  } finally {
    await prisma.$disconnect();
  }
}

verify();
