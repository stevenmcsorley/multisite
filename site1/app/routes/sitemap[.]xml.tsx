import type { LoaderFunction } from "@remix-run/node";
import { client } from "../utils/db.server";

/**
 * By convention, this route is at /sitemap.xml
 * Remix will allow requests to /sitemap.xml to invoke this loader.
 */
export const loader: LoaderFunction = async () => {
  // 1) Fetch all names from DB
  const result = await client.query<{ name: string }>(
    `SELECT name FROM baby_names ORDER BY name ASC`
  );
  const names = result.rows.map((r) => r.name);

  // 2) Build the sitemap. Typically you only need <loc> and <lastmod>.
  // We’ll keep it simple for demonstration. Adjust to your preference.
  const domain = "https://baobaonames.com"; // adjust to your actual domain

  // Start the XML response
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  for (const name of names) {
    // Encode name for use in a URL, e.g. "Aïko" => "A%C3%AFko"
    const loc = `${domain}/name/${encodeURIComponent(name)}`;
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${loc}</loc>\n`;
    sitemap += `  </url>\n`;
  }

  sitemap += `</urlset>\n`;

  return new Response(sitemap, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
    },
  });
};
