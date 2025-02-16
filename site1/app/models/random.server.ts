// app/models/random.server.ts

import { client } from "../utils/db.server";

export async function getRandomName(): Promise<string | null> {
  const sql = `
    SELECT name
    FROM baby_names
    ORDER BY RANDOM()
    LIMIT 1
  `;
  const result = await client.query(sql);

  if (result.rows.length === 0) {
    return null;
  }
  return result.rows[0].name;
}
