import dotenv from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema.js';

dotenv.config();

const { Pool } = pg;

declare global {
  var _postgresPool: pg.Pool | undefined;
}

const getConnectionString = (): string | undefined => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  if (process.env.SQL_HOST && process.env.SQL_USER && process.env.SQL_PASSWORD && process.env.SQL_DB_NAME) {
    return `postgres://${process.env.SQL_USER}:${process.env.SQL_PASSWORD}@${process.env.SQL_HOST}/${process.env.SQL_DB_NAME}`;
  }

  return undefined;
};

export const validateDatabaseConfig = () => {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error(
      'Database configuration is missing. Set DATABASE_URL, or SQL_HOST, SQL_USER, SQL_PASSWORD, and SQL_DB_NAME in the environment.'
    );
  }
};

export const createPool = () => {
  if (!global._postgresPool) {
    const connectionString = getConnectionString();

// When using a managed provider DATABASE_URL, enable SSL with
    // rejectUnauthorized=false so Render/Heroku-style Postgres works without
    // requiring CA bundles. For local connection parameters, keep the default
    // client behavior.
    const poolConfig = connectionString
      ? {
          connectionString,
          max: 10,
          connectionTimeoutMillis: 15000,
          ssl: process.env.DATABASE_URL
            ? {
                rejectUnauthorized: false,
              }
            : undefined,
        }
      : {
          host: process.env.SQL_HOST || 'localhost',
          user: process.env.SQL_USER || 'postgres',
          password: process.env.SQL_PASSWORD || 'postgres',
          database: process.env.SQL_DB_NAME || 'postgres',
          max: 10,
          connectionTimeoutMillis: 15000,
        };

    global._postgresPool = new Pool(poolConfig);
    global._postgresPool.on('error', (err) => {
      console.error('Unexpected error on idle SQL pool client:', err);
    });
  }
  return global._postgresPool;
};

const pool = createPool();
export const db = drizzle(pool, { schema });
