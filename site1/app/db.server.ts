// app/db.server.ts

import pkg from "pg";

const { Pool } = pkg;

const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://remix_user:supersecret@postgres:5432/remix_db",
});

export { pool };
