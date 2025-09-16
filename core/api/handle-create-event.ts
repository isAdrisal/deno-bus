import { Context } from "@hono/hono";
import { db } from "../db/db.ts";

export async function handleCreateEvent(c: Context) {
  try {
    const reqBody = await c.req.json();

    const name = reqBody?.eventName?.toUpperCase();

    if (!name) {
      return c.json({
        error: "Bad Request",
        message: "missing 'eventName' field in request",
      }, 400);
    }

    delete reqBody.eventName;

    const event = db.insertEvent(name, reqBody);

    if (!event) {
      throw new Error("could not create event");
    }

    return c.json(event, 202);
  } catch (e) {
    console.error(e);

    return c.json({
      error: "Internal Server Error",
      message: "could not process event",
    }, 500);
  }
}
