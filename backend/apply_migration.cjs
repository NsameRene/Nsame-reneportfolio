const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const fs = require('fs');

const pool = new Pool({
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  host: process.env.SQL_HOST,
  database: process.env.SQL_DB_NAME,
  port: 5432,
});

const db = drizzle(pool);

async function main() {
  const sql = fs.readFileSync('drizzle/0000_luxuriant_prowler.sql', 'utf8');
  await pool.query(sql);
  console.log('Migration applied successfully');
  process.exit(0);
}

main().catch(console.error);
