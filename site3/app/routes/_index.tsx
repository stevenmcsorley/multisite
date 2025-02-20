// app/routes/_index.tsx
import type { LoaderFunction, MetaFunction } from "@remix-run/node";

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
  return (
    <div
      className="flex h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <div className="text-center p-6 bg-white bg-opacity-80 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800">Half a Giraffe</h1>
        <p className="mt-4 text-gray-600">
          A space for ideas, experiments, and projects.
        </p>
        <button className="mt-6 inline-block bg-blue-500 text-white px-6 py-3 rounded-lg shadow hover:bg-blue-600 transition">
          Explore
        </button>
      </div>
    </div>
  );
}
