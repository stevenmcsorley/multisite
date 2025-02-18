// app/utils/metrics.server.ts

import { Counter, collectDefaultMetrics, register } from "prom-client";

// Collect default metrics (this will run only once)
collectDefaultMetrics();

// Create a custom counter for HTTP requests
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "path", "site"],
});

export { register };
