// app/routes/blog.tsx

import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { BlogPage } from "../components/BlogPage";

export const loader: LoaderFunction = async () => {
  return null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Our Blog" },
    { name: "description", content: "Latest posts and updates." },
  ];
};

export default function Blog() {
  return <BlogPage />;
}
