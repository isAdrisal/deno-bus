import { bus } from "./core/event-bus/event-bus.ts";
import { someEventHandler } from "./services/some-service/some-service.ts";

/**
 * Registers event bus handlers on startup.
 *
 * Consumers are registered using the `bus.on()` method.
 */
export function registerConsumers() {
  bus.on("SOME_EVENT", someEventHandler);
}
