// app/routes/index.tsx
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { json } from "@remix-run/node";
import { pool } from "../db.server";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "Site 3 Remix App" },
    { name: "description", content: "Welcome to Remix on Site 3!" },
  ];
};

type DataItem = {
  id: number;
  title: string;
  content: string;
};

export const loader: LoaderFunction = async () => {
  // Query the test data from the site1_data table.
  const result = await pool.query("SELECT * FROM site3_data");
  const items: DataItem[] = result.rows;
  return json({ items });
};

export default function Index() {
  const { items } = useLoaderData<{ items: DataItem[] }>();

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col gap-6">
        <header>
          <h1 className="text-2xl font-bold">Welcome to Site 3 Remix App</h1>
        </header>
        <section>
          <h2 className="text-xl">Test Data from the Database</h2>
          <ul>
            {items.map((item) => (
              <li key={item.id} className="border p-2 my-2">
                <h3 className="font-semibold">{item.title}</h3>
                <p>{item.content}</p>
              </li>
            ))}
          </ul>
        </section>
        {/* You can keep your original resources section here */}
      </div>
    </div>
  );
}
