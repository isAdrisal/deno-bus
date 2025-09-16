import { DatabaseSync, SQLOutputValue } from "node:sqlite";
import { generate as uuid7 } from "@std/uuid/unstable-v7";

try {
  await Deno.lstat("./config");
} catch (err) {
  if (!(err instanceof Deno.errors.NotFound)) {
    throw err;
  }

  throw new Error("config data directory not found");
}

const database = new DatabaseSync("./config/service.db");

class Database {
  #db: DatabaseSync;
  #insertEventStatement;
  #selectEventByRowIdStatement;

  constructor(database: DatabaseSync) {
    database.exec(
      `
      CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        createdAt TEXT,
        name TEXT,
        details TEXT
      );
      `,
    );

    this.#db = database;

    this.#insertEventStatement = this.#db.prepare(
      `INSERT INTO events (id, createdAt, name, details) VALUES (:id, :createdAt, :name, :details)`,
    );

    this.#selectEventByRowIdStatement = this.#db.prepare(
      `SELECT * FROM events WHERE ROWID = :rowId`,
    );
  }

  public insertEvent(
    name: string,
    details: EventRecord,
  ): EventRecord | undefined {
    try {
      const now = new Date();

      const { lastInsertRowid } = this.#insertEventStatement.run({
        id: uuid7(),
        createdAt: now.toISOString(),
        name: name.toUpperCase(),
        details: JSON.stringify(details),
      });

      if (!lastInsertRowid) {
        throw new Error(JSON.stringify(details, null, 2));
      }

      return this.#selectEventByRowId(lastInsertRowid);
    } catch (e) {
      console.error("could not insert new event", { cause: e });
    }
  }

  #selectEventByRowId(rowId: number | bigint) {
    const data = this.#selectEventByRowIdStatement.get({ rowId });
    if (!data) return undefined;
    return parseEventRow(data);
  }
}

export const db = new Database(database);

function parseEventRow(
  data: Record<string, SQLOutputValue>,
): EventRecord {
  return {
    id: data.id as string,
    createdAt: new Date(data.createdAt as string),
    name: data.name as string,
    details: JSON.parse(data.details as string),
  };
}

export interface EventRecord {
  id: string;
  createdAt: Date;
  name: string;
  details: JsonValue;
}

type JsonObject = { [key: string]: JsonValue };

type JsonValue =
  | null
  | boolean
  | number
  | string
  | JsonValue[]
  | JsonObject;
