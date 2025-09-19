/**
 * An example implementation of a service that is used in an event consumer.
 *
 * The specific implementation is unimportant, besides the `EventHandler` interface
 * as the event data structure.
 */

import { EventRecord } from "../../core/db/db.ts";

class SomeService {
  constructor() {}

  async doSomething(p: EventRecord) {
    console.log("Hello from SomeService:\n", p.name);
    await Promise.resolve(); // example async method
  }
}

const someService = new SomeService();

export async function someEventHandler(p: EventRecord) {
  await someService.doSomething(p);
}
