import { EventRecord } from "../db/db.ts";

export type EventHandler = (payload: EventRecord) => Promise<void>;

class EventBus {
  #handlers: Map<string, EventHandler[]> = new Map();

  /**
   * Registers a new handler function for a specific event.
   * @param event The name of the event to listen for.
   * @param handler The function to execute when the event is dispatched.
   */
  public on(event: string, handler: EventHandler): void {
    if (!this.#handlers.has(event)) {
      this.#handlers.set(event, []);
    }

    this.#handlers.get(event)?.push(handler);
  }

  /**
   * Dispatches an event, triggering all registered handlers.
   * @param event The name of the event to dispatch.
   * @param payload The data to be passed to the handlers.
   */
  public async dispatch(event: string, payload: EventRecord): Promise<void> {
    const eventHandlers = this.#handlers.get(event);
    if (!eventHandlers) {
      console.warn(`no handlers registered for event: ${event}`);
      return;
    }

    for (const handler of eventHandlers) {
      try {
        await handler(payload);
      } catch (e) {
        console.error(`handler for event "${event}" failed:`, e);
      }
    }
  }
}

export const bus = new EventBus();
