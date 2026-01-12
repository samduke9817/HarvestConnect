import Database from "better-sqlite3";
import crypto from "crypto";

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

const dbPath = "harvestconnect.db";
const db = new Database(dbPath);

// List all tables and their columns
console.log("=== Database Schema ===\n");

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();

tables.forEach(table => {
  const tableName = table.name;
  console.log(`\nTable: ${tableName}`);
  
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  columns.forEach(col => {
    console.log(`  - ${col.name}: ${col.type}`);
  });
});

db.close();
