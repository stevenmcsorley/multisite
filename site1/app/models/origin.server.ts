// app/models/origin.server.ts

import { client } from "../utils/db.server";

export async function getDistinctOrigins(): Promise<string[]> {
  const res = await client.query(`
    SELECT DISTINCT origin
    FROM baby_names
    WHERE origin != ''
    ORDER BY origin ASC
  `);
  return res.rows.map((row) => row.origin);
}

// New: Fetch enriched content for a given origin.
export async function getOriginEnrichment(
  origin: string
): Promise<string | null> {
  const res = await client.query(
    `SELECT enriched_content FROM origin_enrichment WHERE origin = $1`,
    [origin]
  );
  if (res.rows.length === 0) {
    return null;
  }
  return res.rows[0].enriched_content;
}
