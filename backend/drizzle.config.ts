import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ||
      `postgres://${process.env.SQL_USER || "postgres"}:${process.env.SQL_PASSWORD || "postgres"}@${process.env.SQL_HOST || "localhost"}/${process.env.SQL_DB_NAME || "postgres"}`,
    // When using managed providers that require TLS (Render, Heroku),
    // instruct the driver to allow self-signed certs.
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : undefined,
  },
});
