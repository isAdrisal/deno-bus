import { db } from "../db/db.ts";
import { bus } from "../event-bus/event-bus.ts";

export const kv = await Deno.openKv();

export function listenQueueHandler(msg: unknown) {
  if (typeof msg !== "string") {
    console.error("invalid message in queue", msg);
    return;
  }

  const event = db.getEventById(msg);

  if (!event) {
    console.error("could not find event by id: ", msg);
    return;
  }

  if (event.processedAt !== null) {
    console.warn("skipping event with id: ", msg);
    return;
  }

  console.log(
    `processing event with id: ${msg}\n\n${JSON.stringify(event, null, 2)}`,
  );

  bus.dispatch(event.name, event);
}
