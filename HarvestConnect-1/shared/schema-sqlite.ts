import { sql } from 'drizzle-orm';
import {
  index,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  serial,
} from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table
export const sessions = sqliteTable("sessions", {
  sid: text("sid").primaryKey(),
  sess: text("sess").notNull(),
  expire: integer("expire").notNull(),
});

// User storage table
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  role: text("role").notNull().default("consumer"), // consumer, farmer, admin
  phone: text("phone"),
  location: text("location"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Farmer profiles
export const farmers = sqliteTable("farmers", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  farmName: text("farm_name").notNull(),
  description: text("description"),
  county: text("county").notNull(),
  subCounty: text("sub_county"),
  town: text("town"),
  experience: integer("years_experience"),
  specializations: text("specializations"),
  rating: text("rating"),
  totalReviews: integer("total_reviews").default(0),
  isVerified: integer("is_verified").default(0),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Product categories
export const categories = sqliteTable("categories", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Products
export const products = sqliteTable("products", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  farmerId: integer("farmer_id").notNull().references(() => farmers.id),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  unit: text("unit").notNull(),
  stock: integer("stock").notNull().default(0),
  images: text("images"),
  isOrganic: integer("is_organic", { mode: "boolean" }).default(false),
  rating: text("rating").default("0"),
  totalReviews: integer("total_reviews").default(0),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Cart items
export const cart = sqliteTable("cart", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Orders
export const orders = sqliteTable("orders", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: text("user_id").notNull().references(() => users.id),
  farmerId: integer("farmer_id").notNull().references(() => farmers.id),
  totalAmount: text("total_amount").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, shipped, delivered
  shippingAddress: text("shipping_address"),
  phone: text("phone"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Order items (join table)
export const orderItems = sqliteTable("order_items", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  orderId: integer("order_id").notNull().references(() => orders.id),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull(),
  price: text("price").notNull(),
});

// Product reviews
export const reviews = sqliteTable("reviews", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  productId: integer("product_id").notNull().references(() => products.id),
  userId: text("user_id").notNull().references(() => users.id),
  rating: integer("rating", { mode: "number" }).notNull(),
  comment: text("comment").notNull(),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Relations
export const usersRelations = relations(users, ({ sessions: many }));
export const farmersRelations = relations(farmers, ({ user: one, products: many }));
export const categoriesRelations = relations(categories, ({ products: many }));
export const productsRelations = relations(products, ({ farmer: one, category: one, cart: many, reviews: many }));
export const ordersRelations = relations(orders, ({ user: one, farmer: one, items: many }));
export const cartRelations = relations(cart, ({ user: one, product: one }));
export const orderItemsRelations = relations(orderItems, ({ order: one, product: one }));
export const reviewsRelations = relations(reviews, ({ product: one, user: one }));
