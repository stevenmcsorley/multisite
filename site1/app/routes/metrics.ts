// app/routes/metrics.ts
import { collectDefaultMetrics, register } from "prom-client";

import type { LoaderFunction } from "@remix-run/node";

// Collect default metrics into the default registry
collectDefaultMetrics();

export const loader: LoaderFunction = async () => {
  const metrics = await register.metrics();
  return new Response(metrics, {
    status: 200,
    headers: {
      "Content-Type": register.contentType,
    },
  });
};
