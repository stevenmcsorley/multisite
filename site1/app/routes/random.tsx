// app/routes/random.tsx

import type { LoaderFunction } from "@remix-run/node";
import { getRandomName } from "../models/random.server";
import { redirect } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  const randomName = await getRandomName();
  if (!randomName) {
    throw new Response("No names found", { status: 404 });
  }
  return redirect(`/name/${randomName}`);
};
