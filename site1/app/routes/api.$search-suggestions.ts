// app/routes/api.$search-suggestions.ts

import type { LoaderFunction } from "@remix-run/node";
import { findNameSuggestions } from "../models/search.server";
import { json } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const suggestions = await findNameSuggestions(q, 5);
  return json({ suggestions });
};
