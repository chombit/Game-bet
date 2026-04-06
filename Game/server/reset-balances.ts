import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { createClient } from '@libsql/client';
require('dotenv').config();

const libsql = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

const adapter = new PrismaLibSql(libsql as any);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🔄 Checking all balances...');
  const users = await prisma.user.findMany();
  users.forEach(u => console.log(`👤 ${u.name}: ${u.balance} Birr`));

  console.log('\n🔄 Resetting all balances to 1000...');
  const result = await prisma.user.updateMany({
    data: { balance: 1000 }
  });
  console.log(`✅ Updated ${result.count} users.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
