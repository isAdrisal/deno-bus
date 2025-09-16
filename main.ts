import { Hono } from "@hono/hono";
import { logger } from "@hono/hono/logger";
import { handleCreateEvent } from "./core/api/handle-create-event.ts";
import { handleGetEvents } from "./core/api/handle-get-events.ts";
import { Hono } from "jsr:@hono/hono";

const app = new Hono();

app.use(logger());

app.get(
  "/healthz",
  (c) => c.text("ok"),
);

app.get(
  "/events",
  (c) => handleGetEvents(c),
);

app.post(
  "/events/create",
  (c) => handleCreateEvent(c),
);

export default {
  fetch: app.fetch,
} satisfies Deno.ServeDefaultExport;
