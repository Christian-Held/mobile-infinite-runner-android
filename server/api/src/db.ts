import { Pool, QueryResult } from 'pg';
import { env } from './env';

export const pool = new Pool({
  connectionString: env.DATABASE_URL
});

pool.on('error', (err: Error) => {
  console.error('Unexpected database error', err);
});

export const query = async <T = unknown>(text: string, params: unknown[] = []): Promise<QueryResult<T>> => {
  return pool.query<T>(text, params);
};
