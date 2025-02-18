// app/utils/metrics.server.ts

import { Counter, collectDefaultMetrics, register } from "prom-client";

// Collect default metrics (e.g., CPU usage, memory, etc.)
collectDefaultMetrics();

// Create a custom counter for HTTP requests
export const httpRequestsTotal = new Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "path"],
});

// Export the registry so it can be used in your /metrics route
export { register };
