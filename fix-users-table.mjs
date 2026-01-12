import Database from "better-sqlite3";
import crypto from "crypto";

const dbPath = "harvestconnect.db";
const db = new Database(dbPath);

// Drop and recreate users table with password column
console.log("Dropping users table...");
db.prepare("DROP TABLE IF EXISTS users").run();

console.log("Creating users table with password column...");
db.prepare(`
  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE,
    password TEXT,
    first_name TEXT,
    last_name TEXT,
    profile_image_url TEXT,
    role TEXT NOT NULL DEFAULT 'consumer',
    phone TEXT,
    location TEXT,
    created_at INTEGER DEFAULT (strftime('%s', 'now')),
    updated_at INTEGER DEFAULT (strftime('%s', 'now'))
  )
`).run();

console.log("Users table created with password column");
db.close();
