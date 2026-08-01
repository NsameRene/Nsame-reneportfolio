import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS settings (
      id integer PRIMARY KEY,
      name text,
      email text,
      bio text,
      "profileImageUrl" text,
      phone text,
      location text,
      website text
    );
  `);
  console.log("Settings table created successfully!");
  process.exit(0);
}
main().catch(console.error);
