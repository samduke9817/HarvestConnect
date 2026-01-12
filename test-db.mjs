import Database from "better-sqlite3";
import crypto from "crypto";

const hashPassword = (password) => crypto.createHash("sha256").update(password).digest("hex");

const dbPath = "harvestconnect.db";
const db = new Database(dbPath);

const now = Math.floor(Date.now() / 1000);

console.log("Seeding test users...\n");

// Create admin user
const adminUserId = `admin_${now}`;
const adminResult = db.prepare(`
  INSERT OR IGNORE INTO users
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(adminUserId, "admin@harvesthub.co.ke", hashPassword("admin123"), "Admin", "User", null, "admin", null, null, now, now);
console.log("✓ Admin user created:", adminUserId);

// Create regular consumer user
const consumerUserId = `consumer_${now + 1}`;
db.prepare(`
  INSERT OR IGNORE INTO users
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(consumerUserId, "user@harvesthub.co.ke", hashPassword("user123"), "John", "Doe", null, "consumer", null, null, now, now);
console.log("✓ Consumer user created:", consumerUserId);

// Create farmer user
const farmerUserId = `farmer_${now + 2}`;
db.prepare(`
  INSERT OR IGNORE INTO users
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(farmerUserId, "farmer@harvesthub.co.ke", hashPassword("farmer123"), "Mary", "Wanjiku", null, "farmer", null, null, now, now);
console.log("✓ Farmer user created:", farmerUserId);

// Create farmer profile
const farmerResult = db.prepare(`
  INSERT INTO farmers (user_id, farm_name, description, county, sub_county, town, years_experience, specializations, rating, total_reviews, is_verified, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(farmerUserId, "Mary's Organic Farm", "Certified organic vegetables and fruits", "Nakuru", "Nakuru North", null, 8, JSON.stringify(["Vegetables", "Fruits", "Herbs"]), "4.5", 25, null, now, now);
const farmerId = farmerResult.lastInsertRowid;
console.log("✓ Farmer profile created, ID:", farmerId);

// Create categories
const vegetablesResult = db.prepare(`
  INSERT OR IGNORE INTO categories (name, description, icon, created_at)
  VALUES (?, ?, ?, ?)
`).run("Vegetables", "Fresh organic vegetables", "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200", now);
const vegetablesId = vegetablesResult.lastInsertRowid;
console.log("✓ Vegetables category created, ID:", vegetablesId);

const fruitsResult = db.prepare(`
  INSERT OR IGNORE INTO categories (name, description, icon, created_at)
  VALUES (?, ?, ?, ?)
`).run("Fruits", "Fresh seasonal fruits", "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200", now);
const fruitsId = fruitsResult.lastInsertRowid;
console.log("✓ Fruits category created, ID:", fruitsId);

// Create products
db.prepare(`
  INSERT INTO products (farmer_id, category_id, name, description, price, unit, stock, images, is_organic, harvest_date, expiry_date, rating, total_reviews, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(farmerId, vegetablesId, "Organic Tomatoes", "Fresh, organic tomatoes harvested daily from our farm", "120", "kg", 50, JSON.stringify(["https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400"]), 1, null, null, "4.8", 15, 1, now, now);
console.log("✓ Product 'Organic Tomatoes' created");

db.prepare(`
  INSERT INTO products (farmer_id, category_id, name, description, price, unit, stock, images, is_organic, harvest_date, expiry_date, rating, total_reviews, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(farmerId, vegetablesId, "Fresh Spinach", "Crispy, nutrient-rich spinach bunches", "50", "bunch", 30, JSON.stringify(["https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"]), 1, null, null, "4.6", 12, 1, now, now);
console.log("✓ Product 'Fresh Spinach' created");

db.prepare(`
  INSERT INTO products (farmer_id, category_id, name, description, price, unit, stock, images, is_organic, harvest_date, expiry_date, rating, total_reviews, is_active, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(farmerId, fruitsId, "Sweet Bananas", "Locally grown sweet bananas", "200", "dozen", 25, JSON.stringify(["https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=400"]), 1, null, null, "4.9", 20, 1, now, now);
console.log("✓ Product 'Sweet Bananas' created");

db.close();

console.log("\n=== Database seeded successfully! ===\n");
console.log("\nTest Accounts:");
console.log("  Admin:   admin@harvesthub.co.ke / admin123");
console.log("  User:    user@harvesthub.co.ke / user123");
console.log("  Farmer:  farmer@harvesthub.co.ke / farmer123");
