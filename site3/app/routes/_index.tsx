// app/routes/_index.tsx
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

import { HomePage } from "../components/HomePage";
import { httpRequestsTotal } from "../utils/metrics.server";

export const loader: LoaderFunction = async ({ request }) => {
  // Increment the counter for this route
  httpRequestsTotal.inc({ method: request.method, path: "/", site: "site3" });

  console.log(
    JSON.stringify({
      level: "info",
      message: "Index route accessed",
      method: request.method,
      path: "/",
      site: "site3",
    })
  );

  return null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "Half a Giraffe" },
    {
      name: "description",
      content:
        "Exploring ideas, building cool projects, and having fun along the way.",
    },
  ];
};

export default function Index() {
  return <HomePage />;
}
