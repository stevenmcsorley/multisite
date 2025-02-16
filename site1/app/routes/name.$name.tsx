// app/routes/name.$name.tsx

import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";

import { client } from "../utils/db.server";
import { createSeoMeta } from "../utils/seo";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

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

/**
 * The meta function casts the incoming data to BabyName so that properties like
 * `name` and `meaning` are recognized. It uses our SEO helper to build meta tags,
 * but omits the canonical key so that it’s not rendered as a meta tag.
 */
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
    canonical: `https://baobaonames.com/name/${babyData.name}`,
    image: "https://baobaonames.com/images/og-image.png", // Updated image URL
  });

  return Object.entries(seo.meta).map(([key, value]) => {
    if (key === "title") return { title: value };
    if (key.startsWith("og:")) return { property: key, content: value };
    if (key.startsWith("twitter:")) return { name: key, content: value };
    return { name: key, content: value };
  });
};

/**
 * Export a links function so that the canonical URL is rendered as a <link> tag.
 * We explicitly type the argument and provide a default value so that even if
 * the function is called without arguments, it returns an empty array.
 */
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

export default function NameDetailRoute() {
  const data = useLoaderData<BabyName>();

  // Process basic string fields.
  const famousPeople = data.famous_people?.split(", ") ?? [];
  const histFigures = data.historic_figures?.split(", ") ?? [];

  // Helper function to render an enriched section.
  function renderEnrichedSection(
    title: string,
    enrichedField: Record<string, string>
  ) {
    if (!enrichedField || Object.keys(enrichedField).length === 0) {
      return null;
    }
    return (
      <div className="mt-4">
        <h3 className="font-semibold text-xl">{title}</h3>
        {Object.entries(enrichedField).map(([key, paragraph]) => (
          <p key={key} className="mb-2">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow">
      <div className="card-body">
        {data.name ? (
          <>
            <h1 className="card-title text-3xl mb-2">{data.name}</h1>
            <p className="mb-2">
              <strong>Meaning:</strong> {data.meaning}
            </p>
            <p className="mb-2">
              <strong>Origin:</strong> {data.origin}
            </p>

            <div className="mt-4">
              <h2 className="font-semibold text-xl">Famous People</h2>
              <ul className="list-disc list-inside mb-2">
                {famousPeople.map((fp: string) => fp && <li key={fp}>{fp}</li>)}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-xl">Historical Figures</h2>
              <ul className="list-disc list-inside mb-2">
                {histFigures.map((hf: string) => hf && <li key={hf}>{hf}</li>)}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-xl">Interesting Facts</h2>
              <p>{data.interesting_facts}</p>
            </div>

            {/* Render enriched sections if available */}
            {renderEnrichedSection("In-Depth Meaning", data.in_depth_meaning)}
            {renderEnrichedSection(
              "Historical Background",
              data.historical_background
            )}
            {renderEnrichedSection(
              "Cultural Significance",
              data.cultural_significance
            )}
            {renderEnrichedSection(
              "Detailed Interesting Facts",
              data.detailed_interesting_facts
            )}
          </>
        ) : (
          <>
            <h2 className="card-title text-2xl text-error">Name Not Found</h2>
            <p>Sorry, we couldn’t find that name in our database.</p>
          </>
        )}
        <div className="mt-4">
          <a href="/" className="btn btn-outline">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
