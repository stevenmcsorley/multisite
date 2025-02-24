import type { LoaderFunction } from "@remix-run/node";
import { client } from "../utils/db.server";

/**
 * By convention, this route is at /sitemap.xml
 * Remix will allow requests to /sitemap.xml to invoke this loader.
 */
export const loader: LoaderFunction = async () => {
  const domain = "https://baobaonames.com"; // adjust to your actual domain

  // Start the XML response
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  sitemap += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // 1. Add the blog homepage
  sitemap += `  <url>\n`;
  sitemap += `    <loc>${domain}/blog</loc>\n`;
  sitemap += `  </url>\n`;

  // 2. Add each blog post URL
  const postsResult = await client.query<{ slug: string }>(
    `SELECT slug FROM blog_posts`
  );
  for (const post of postsResult.rows) {
    const loc = `${domain}/blog/${encodeURIComponent(post.slug)}`;
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${loc}</loc>\n`;
    sitemap += `  </url>\n`;
  }

  // 3. Add each distinct blog category URL
  const categoriesResult = await client.query<{ category: string }>(
    `SELECT DISTINCT category FROM blog_posts WHERE category IS NOT NULL AND category <> ''`
  );
  for (const row of categoriesResult.rows) {
    const loc = `${domain}/blog-category/${encodeURIComponent(row.category)}`;
    sitemap += `  <url>\n`;
    sitemap += `    <loc>${loc}</loc>\n`;
    sitemap += `  </url>\n`;
  }

  // 4. Add each individual blog tag URL.
  // Since tags are stored as comma-separated values, we need to split them
  const tagsResult = await client.query<{ tags: string }>(
    `SELECT tags FROM blog_posts WHERE tags IS NOT NULL AND tags <> ''`
  );
  const tagSet = new Set<string>();
  for (const row of tagsResult.rows) {
    // Split by comma, trim each tag, and add to the set
    row.tags.split(",").forEach((tag) => {
      const trimmed = tag.trim();
      if (trimmed) tagSet.add(trimmed);
    });
  }
  for (const tag of tagSet) {
    const loc = `${domain}/blog-tag/${encodeURIComponent(tag)}`;
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
