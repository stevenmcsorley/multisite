// app/routes/stats.tsx

import type { LoaderFunction } from "@remix-run/node";
import { StatsCard } from "../components/StatsCard";
import { getDbStats } from "../models/stats.server";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader: LoaderFunction = async () => {
  const stats = await getDbStats();
  return json({ stats });
};

export default function StatsPage() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen w-full bg-base-200 p-6">
      <h1 className="text-3xl font-bold text-center mb-8">Dashboard</h1>
      <div className="flex flex-col items-center justify-center space-y-6">
        <StatsCard stats={stats} />
        {/* 
          If you have additional cards or widgets,
          you can add them here and arrange them using grid/flex layouts.
        */}
      </div>
    </div>
  );
}
