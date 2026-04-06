const { createClient } = require('@libsql/client');
require('dotenv').config();

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});

async function main() {
  console.log('🔄 Connecting to database directly via LibSql Client...');
  
  try {
    const result = await client.execute('UPDATE User SET balance = 1000;');
    console.log(`✅ Success! Reset all user balances to 1000.`);
    console.log(`📊 Rows affected: ${result.rowsAffected}`);
  } catch (err) {
    console.error('❌ Failed to reset balances:', err);
  } finally {
    process.exit(0);
  }
}

main();
