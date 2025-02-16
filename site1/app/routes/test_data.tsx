import { json } from "@remix-run/node";
import pkg from "pg";
import { useLoaderData } from "@remix-run/react";

const { Client } = pkg;

// We'll need a DB client (pg, knex, prisma, etc.) for Node.
// Example with 'pg' usage:

export async function loader() {
  // Connect to DB using environment variable
  const dbUrl = process.env.DATABASE_URL;
  const client = new Client({ connectionString: dbUrl });
  await client.connect();

  // Query test_names
  const result = await client.query(`
    SELECT id, name, origin, meaning
    FROM test_names
    ORDER BY id ASC
  `);

  await client.end();

  return json({ rows: result.rows });
}

export default function TestData() {
  const { rows } = useLoaderData<{
    rows: { id: number; name: string; origin: string; meaning: string }[];
  }>();

  return (
    <div>
      <h1>Test Data</h1>
      {rows.length > 0 ? (
        <ul>
          {rows.map((r) => (
            <li key={r.id}>
              <strong>{r.name}</strong> [{r.origin}] - {r.meaning}
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
}
