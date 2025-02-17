// app/routes/metrics.ts
import { Register, collectDefaultMetrics } from 'prom-client';
import type { LoaderFunction } from '@remix-run/node';

// Create a registry
const register = new Register();

// Collect default metrics
collectDefaultMetrics({ register });

export const loader: LoaderFunction = async () => {
  const metrics = await register.metrics();
  return new Response(metrics, {
    status: 200,
    headers: {
      'Content-Type': register.contentType,
    },
  });
};
