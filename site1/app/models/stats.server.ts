// app/models/stats.server.ts

import { client } from "../utils/db.server";

// Type definitions for each piece of data
export interface Stats {
  total_names: number;
  distinct_origins: number;
  top_origins: { origin: string; count: number }[];
  with_meaning: number;
  no_meaning: number;
  with_famous: number;
  with_historic: number;
  with_facts: number;
  avg_len: number;
  longest_names: { name: string; length: number }[];
  shortest_names: { name: string; length: number }[];
  common_words: { word: string; freq: number }[];
  enriched_count: number;
  last_enriched_names: string[];
}

export async function getDbStats(): Promise<Stats> {
  // 1. total number
  const totalNamesRes = await client.query<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM baby_names
  `);
  const total_names = totalNamesRes.rows[0].cnt;

  // 2. distinct origins
  const distOriginsRes = await client.query<{ cnt: number }>(`
    SELECT COUNT(DISTINCT origin) as cnt
    FROM baby_names
    WHERE origin != ''
  `);
  const distinct_origins = distOriginsRes.rows[0].cnt;

  // 3. top 10 origins
  const topOriginsRes = await client.query<{ origin: string; c: number }>(`
    SELECT origin, COUNT(*) as c
    FROM baby_names
    WHERE origin != ''
    GROUP BY origin
    ORDER BY c DESC
    LIMIT 10
  `);
  const top_origins = topOriginsRes.rows.map((row) => ({
    origin: row.origin,
    count: row.c,
  }));

  // 4. entries with meaning
  const withMean = await client.query<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM baby_names
    WHERE meaning != ''
  `);
  const with_meaning = withMean.rows[0].cnt;
  const no_meaning = total_names - with_meaning;

  // 5. with famous
  const withFamous = await client.query<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM baby_names
    WHERE famous_people != ''
  `);
  const with_famous = withFamous.rows[0].cnt;

  // 6. with historic
  const withHistoric = await client.query<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM baby_names
    WHERE historic_figures != ''
  `);
  const with_historic = withHistoric.rows[0].cnt;

  // 7. with facts
  const withFacts = await client.query<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM baby_names
    WHERE interesting_facts != ''
  `);
  const with_facts = withFacts.rows[0].cnt;

  // 8. average length (cast to float8 so Postgres returns a real number)
  const avgLen = await client.query<{ avg_len: number }>(`
    SELECT AVG(LENGTH(name))::float8 as avg_len
    FROM baby_names
  `);
  const avg_len = avgLen.rows[0].avg_len;

  // 9. top 3 longest
  const longestRes = await client.query<{ name: string; l: number }>(`
    SELECT name, LENGTH(name) as l
    FROM baby_names
    ORDER BY l DESC
    LIMIT 3
  `);
  const longest_names = longestRes.rows.map((r) => ({
    name: r.name,
    length: r.l,
  }));

  // 10. top 3 shortest
  const shortestRes = await client.query<{ name: string; l: number }>(`
    SELECT name, LENGTH(name) as l
    FROM baby_names
    ORDER BY l ASC
    LIMIT 3
  `);
  const shortest_names = shortestRes.rows.map((r) => ({
    name: r.name,
    length: r.l,
  }));

  // 11. top 10 words in meanings (Node-based word counting)
  const allMeanings = await client.query<{ meaning: string }>(`
    SELECT meaning
    FROM baby_names
  `);
  const STOPWORDS = new Set([
    "is",
    "of",
    "the",
    "or",
    "and",
    "my",
    "in",
    "to",
    "a",
    "one",
  ]);
  const freqMap = new Map<string, number>();
  for (const row of allMeanings.rows) {
    if (!row.meaning) continue;
    const words = row.meaning.toLowerCase().match(/[a-z]+/g) || [];
    for (const w of words) {
      if (!STOPWORDS.has(w)) {
        freqMap.set(w, (freqMap.get(w) || 0) + 1);
      }
    }
  }
  const sorted = [...freqMap.entries()].sort((a, b) => b[1] - a[1]);
  const top10 = sorted.slice(0, 10).map(([word, freq]) => ({ word, freq }));

  // 12. enriched count: number of records with any enrichment data added
  const enrichedRes = await client.query<{ cnt: number }>(`
    SELECT COUNT(*) as cnt
    FROM baby_names
    WHERE in_depth_meaning <> '{}'::jsonb
       OR historical_background <> '{}'::jsonb
       OR cultural_significance <> '{}'::jsonb
       OR seo_enriched_description <> '{}'::jsonb
       OR detailed_interesting_facts <> '{}'::jsonb
  `);
  const enriched_count = enrichedRes.rows[0].cnt;

  // 13. last 5 enriched names (using ctid as a proxy for insertion order)
  const lastEnrichedRes = await client.query<{ name: string }>(`
    SELECT name
    FROM baby_names
    WHERE in_depth_meaning <> '{}'::jsonb
       OR historical_background <> '{}'::jsonb
       OR cultural_significance <> '{}'::jsonb
       OR seo_enriched_description <> '{}'::jsonb
       OR detailed_interesting_facts <> '{}'::jsonb
    ORDER BY ctid DESC
    LIMIT 5
  `);
  const last_enriched_names = lastEnrichedRes.rows.map((r) => r.name);

  return {
    total_names,
    distinct_origins,
    top_origins,
    with_meaning,
    no_meaning,
    with_famous,
    with_historic,
    with_facts,
    avg_len,
    longest_names,
    shortest_names,
    common_words: top10,
    enriched_count,
    last_enriched_names,
  };
}
