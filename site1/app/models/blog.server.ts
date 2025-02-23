import { client } from "../utils/db.server";

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: Record<string, string>;
  meta_title?: string;
  meta_description?: string;
  excerpt?: string;
  thumbnail_url?: string;
  category?: string;
  tags?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  author?: string;
};

export async function getAllBlogPosts(
  page: number,
  limit: number
): Promise<{ rows: BlogPost[]; total: number }> {
  const offset = (page - 1) * limit;
  const data = await client.query(
    `SELECT * FROM blog_posts ORDER BY id DESC LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  const countResult = await client.query(`SELECT COUNT(*) FROM blog_posts`);
  return { rows: data.rows, total: parseInt(countResult.rows[0].count, 10) };
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const result = await client.query(
    `SELECT * FROM blog_posts WHERE slug = $1`,
    [slug]
  );
  return result.rows.length > 0 ? result.rows[0] : null;
}

export async function getAllBlogPostsByCategory(
  category: string,
  page: number,
  limit: number
): Promise<{ rows: BlogPost[]; total: number }> {
  const offset = (page - 1) * limit;
  const data = await client.query(
    `SELECT * FROM blog_posts WHERE category = $1 ORDER BY id DESC LIMIT $2 OFFSET $3`,
    [category, limit, offset]
  );
  const countResult = await client.query(
    `SELECT COUNT(*) FROM blog_posts WHERE category = $1`,
    [category]
  );
  return { rows: data.rows, total: parseInt(countResult.rows[0].count, 10) };
}
