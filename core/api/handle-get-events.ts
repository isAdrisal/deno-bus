import { Context } from "@hono/hono";
import { db } from "../db/db.ts";

export function handleGetEvents(c: Context) {
  const events = db.getEvents();

  return c.json({ events });
}
