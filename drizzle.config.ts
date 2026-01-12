import { defineConfig } from "drizzle-kit";

const dbPath = process.env.DATABASE_URL?.replace(/^\.\//, '') || 'harvestconnect.db';

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema-sqlite.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: dbPath,
  },
});
