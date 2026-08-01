import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS what_i_do (
      id serial PRIMARY KEY,
      title text NOT NULL,
      icon text NOT NULL,
      items text NOT NULL
    );
  `);
  console.log("Table created successfully!");
  process.exit(0);
}
main().catch(console.error);
