import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema-sqlite";

const dbPath = process.env.DATABASE_URL?.replace(/^\.\//, '') || 'harvestconnect.db';
console.log('Opening database at:', dbPath);
const sqliteDb = new Database(dbPath);

sqliteDb.pragma('journal_mode = WAL');

export const db = drizzle(sqliteDb, { schema });
export const pool = null;
export const sqlite = sqliteDb;
console.log('Database initialized successfully');