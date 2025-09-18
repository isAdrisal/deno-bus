# deno-bus

An event bus server built with deno.

Events are processed using an outbox pattern to decouple event creation from handling.

## API

**GET `/events`**

Returns a JSON array of all stored events.

**POST `/events/create`**

Accepts a JSON-encoded request body containing a single object, with a required `eventName` key.

All other keys will be treated as event details.
