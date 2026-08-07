import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import * as schema from "./schema";
import fs from "node:fs";
import path from "node:path";

const dbPath = process.env.DATABASE_PATH || "./data/woodshop.db";

// Ensure the directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize better-sqlite3
const sqlite = new Database(dbPath);
// Use WAL mode for better concurrency in SQLite
sqlite.pragma("journal_mode = WAL");

// Initialize drizzle
export const db = drizzle(sqlite, { schema });

// Run migrations automatically
migrate(db, {
  migrationsFolder: path.join(process.cwd(), "src/db/migrations"),
});
