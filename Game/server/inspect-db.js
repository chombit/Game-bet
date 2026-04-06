const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

async function main() {
  console.log('🔄 Inspecting tables...');
  
  try {
    const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log('📊 Tables found:', tables.rows.map(r => r.name));
    
    for (const table of tables.rows) {
      const name = table.name;
      if (name.toLowerCase() === 'user') {
        const result = await client.execute(`UPDATE ${name} SET balance = 1000;`);
        console.log(`✅ Success! Reset all balances in table "${name}".`);
        console.log(`📊 Rows affected: ${result.rowsAffected}`);
        
        const users = await client.execute(`SELECT name, balance FROM ${name};`);
        users.rows.forEach(u => console.log(`👤 ${u.name}: ${u.balance} Birr`));
      }
    }
  } catch (err) {
    console.error('❌ Failed to inspect/update:', err);
  } finally {
    process.exit(0);
  }
}

main();
