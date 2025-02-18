import type { LoaderFunction } from "@remix-run/node";
// app/routes/metrics.ts
import { register } from "prom-client"; // No collectDefaultMetrics() here

export const loader: LoaderFunction = async () => {
  const metrics = await register.metrics();
  return new Response(metrics, {
    status: 200,
    headers: {
      "Content-Type": register.contentType,
    },
  });
};
