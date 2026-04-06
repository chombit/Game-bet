const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

async function main() {
  console.log('🔍 [DB INSPECTOR] Checking all tables in dev.db...');
  
  try {
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    const tableNames = tables.rows.map(r => r.name).filter(n => !n.startsWith('sqlite_'));
    
    console.log('📊 Tables to check:', tableNames);
    
    for (const name of tableNames) {
      const countResult = await client.execute(`SELECT COUNT(*) as count FROM ${name};`);
      const count = countResult.rows[0].count;
      console.log(`🔹 Table [${name}]: ${count} rows`);
      
      if (count > 0) {
        const data = await client.execute(`SELECT * FROM ${name} LIMIT 3;`);
        console.log(`   📄 Samples:`, JSON.stringify(data.rows, null, 2));
      }
    }
  } catch (err) {
    console.error('❌ Inspection failed:', err);
  } finally {
    process.exit(0);
  }
}

main();
