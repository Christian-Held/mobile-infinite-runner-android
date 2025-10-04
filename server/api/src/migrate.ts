import fs from 'fs';
import path from 'path';
import { pool } from './db';

const migrationsDir = path.resolve(__dirname, '../src/migrations');

export const runMigrations = async () => {
  const client = await pool.connect();
  try {
    await client.query(
      'CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW())'
    );

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const name = file;
      const alreadyApplied = await client.query('SELECT 1 FROM _migrations WHERE name = $1', [name]);
      if (alreadyApplied.rowCount > 0) {
        continue;
      }

      const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

      await client.query('BEGIN');
      try {
        await client.query(sql);
        await client.query('INSERT INTO _migrations (name, applied_at) VALUES ($1, NOW())', [name]);
        await client.query('COMMIT');
        console.log(`Applied migration ${name}`);
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations finished');
    })
    .catch((err) => {
      console.error('Migration failed', err);
      process.exit(1);
    });
}
