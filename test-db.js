const Database = require("better-sqlite3");
const db = new Database("harvestconnect.db");
console.log("Database opened");
const result = db.prepare("SELECT COUNT(*) as count FROM users").get();
console.log("Users count:", result.count);
db.close();
console.log("Database closed");
