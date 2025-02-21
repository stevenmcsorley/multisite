// app/routes/name.$name.tsx

import { Link, useLoaderData } from "@remix-run/react";
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { client } from "../utils/db.server";
import { createSeoMeta } from "../utils/seo";
import { json } from "@remix-run/node";

// Define a type for the baby name data.
export type BabyName = {
  name: string;
  meaning: string;
  origin: string;
  famous_people: string;
  historic_figures: string;
  interesting_facts: string;
  in_depth_meaning: Record<string, string>;
  historical_background: Record<string, string>;
  cultural_significance: Record<string, string>;
  seo_enriched_description: Record<string, string>;
  detailed_interesting_facts: Record<string, string>;
};

export const loader: LoaderFunction = async ({ params }) => {
  const nameParam = params.name;
  if (!nameParam) {
    throw new Response("Name not specified", { status: 400 });
  }

  const sql = `
    SELECT 
      name, 
      meaning, 
      origin, 
      famous_people, 
      historic_figures, 
      interesting_facts,
      in_depth_meaning, 
      historical_background, 
      cultural_significance, 
      seo_enriched_description, 
      detailed_interesting_facts
    FROM baby_names
    WHERE name = $1
  `;
  const result = await client.query(sql, [nameParam]);
  if (result.rows.length === 0) {
    throw new Response("Not found", { status: 404 });
  }
  // Cast the row to BabyName.
  const row = result.rows[0] as BabyName;
  return json(row);
};

export const meta: MetaFunction = ({ data }) => {
  const babyData = data as BabyName | undefined;
  if (!babyData) {
    return [
      { title: "Name Not Found - Baby Names" },
      {
        name: "description",
        content: "Sorry, we couldn’t find that name in our database.",
      },
    ];
  }

  const seo = createSeoMeta({
    title: `${babyData.name} - Baby Names`,
    description:
      babyData.meaning ||
      `Learn more about the baby name ${babyData.name}, including its origin and interesting facts.`,
    canonical: `https://baobaonames.com/name/${encodeURIComponent(
      babyData.name
    )}`,
    image: "https://baobaonames.com/images/og-image.png",
  });

  return Object.entries(seo.meta).map(([key, value]) => {
    if (key === "title") return { title: value };
    if (key.startsWith("og:")) return { property: key, content: value };
    if (key.startsWith("twitter:")) return { name: key, content: value };
    return { name: key, content: value };
  });
};

export const links: LinksFunction = (
  args: { params: { name?: string } } = { params: {} }
) => {
  const { params } = args;
  const name = params.name;
  return name
    ? [
        {
          rel: "canonical",
          href: `https://baobaonames.com/name/${encodeURIComponent(name)}`,
        },
      ]
    : [];
};

// Reusable component for displaying a labeled detail.
function DetailItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <p className="mb-2">
      <strong>{label}:</strong> {children}
    </p>
  );
}

// Component for rendering sections with lists.
function DetailList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <ul className="list-disc list-inside">
        {items.map((item) => item && <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}

// Component for enriched content sections.
function EnrichedSection({
  title,
  content,
}: {
  title: string;
  content: Record<string, string>;
}) {
  if (!content || Object.keys(content).length === 0) return null;
  return (
    <section className="mt-6">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {Object.entries(content).map(([key, paragraph]) => (
        <p key={key} className="mb-2 leading-relaxed">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export default function NameDetailRoute() {
  const data = useLoaderData<BabyName>();

  // Convert comma-separated strings into arrays.
  const famousPeople = data.famous_people?.split(", ") ?? [];
  const historicalFigures = data.historic_figures?.split(", ") ?? [];

  return (
    <main className="max-w-3xl mx-auto p-6">
      <article className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <header>
            <h1 className="card-title text-4xl mb-4">{data.name}</h1>
          </header>
          <section>
            <DetailItem label="Meaning">{data.meaning || "N/A"}</DetailItem>
            <DetailItem label="Origin">{data.origin || "N/A"}</DetailItem>
          </section>

          <DetailList title="Famous People" items={famousPeople} />
          <DetailList title="Historical Figures" items={historicalFigures} />

          {data.interesting_facts && (
            <section className="mt-4">
              <h2 className="text-xl font-semibold mb-2">Interesting Facts</h2>
              <p>{data.interesting_facts}</p>
            </section>
          )}

          {/* Render enriched sections if available */}
          <EnrichedSection
            title="In-Depth Meaning"
            content={data.in_depth_meaning}
          />
          <EnrichedSection
            title="Historical Background"
            content={data.historical_background}
          />
          <EnrichedSection
            title="Cultural Significance"
            content={data.cultural_significance}
          />
          <EnrichedSection
            title="Detailed Interesting Facts"
            content={data.detailed_interesting_facts}
          />

          <footer className="mt-6">
            <Link to="/" className="btn btn-outline">
              Back to Home
            </Link>
          </footer>
        </div>
      </article>
    </main>
  );
}
