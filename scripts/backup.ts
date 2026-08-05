import Database from "better-sqlite3";
import { join } from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const DATA_DIR = process.env.DATABASE_PATH 
  ? process.env.DATABASE_PATH.replace(/[^/]+$/, "") // Get directory from path
  : "./data";

const DB_PATH = process.env.DATABASE_PATH || "./data/woodshop.db";

// Ensure backup directory exists
const backupDir = join(DATA_DIR, "backups");
if (!existsSync(backupDir)) {
  mkdirSync(backupDir, { recursive: true });
}

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const backupPath = join(backupDir, `woodshop_${timestamp}.db`);

console.log(`Starting backup of ${DB_PATH}...`);
const db = new Database(DB_PATH, { readonly: true });

db.backup(backupPath)
  .then(() => {
    console.log(`Backup completed successfully: ${backupPath}`);
  })
  .catch((err) => {
    console.error(`Backup failed:`, err);
    process.exit(1);
  })
  .finally(() => {
    db.close();
  });
