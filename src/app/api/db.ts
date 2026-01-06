import { Pool } from 'pg';

// Ensure the pool is only created once across your application's lifecycle
declare global {
  // eslint-disable-next-line
  var postgresPool: Pool | undefined;
}

let pool: Pool;

if (process.env.NODE_ENV === 'production') {
  // In production, create a new pool
  pool = new Pool();
} else {
  // In development, reuse the global variable if it exists, otherwise create a new pool
  if (!global.postgresPool) {
    global.postgresPool = new Pool();
  }
  pool = global.postgresPool;
}

export { pool };
