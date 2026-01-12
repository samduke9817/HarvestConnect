import Database from "better-sqlite3";
import crypto from "crypto";

const dbPath = "harvestconnect.db";
const db = new Database(dbPath);

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

console.log("Database file exists");
console.log("\nUsers in database:");
const users = db.prepare("SELECT id, email, password, role FROM users").all();
console.log(users);

console.log("\nPassword hashes:");
console.log("admin123:", hashPassword("admin123"));
console.log("user123:", hashPassword("user123"));
console.log("farmer123:", hashPassword("farmer123"));

db.close();
