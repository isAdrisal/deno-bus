import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.get(
  "/healthz",
  (c) => c.json({ status: "ok", message: "service is healthy" }),
);

export default {
  fetch: app.fetch,
} satisfies Deno.ServeDefaultExport;
