import {
  users,
  farmers,
  categories,
  products,
  cart,
  orders,
  orderItems,
  reviews,
  type User,
  type UpsertUser,
  type Farmer,
  type InsertFarmer,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type Review,
  type InsertReview,
} from "@shared/schema-sqlite";
import { db, sqlite } from "./db";
import { eq, desc, asc, and, or, like, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Farmer operations
  getFarmer(id: number): Promise<Farmer | undefined>;
  getFarmerByUserId(userId: string): Promise<Farmer | undefined>;
  createFarmer(farmer: InsertFarmer): Promise<Farmer>;
  updateFarmer(id: number, farmer: Partial<InsertFarmer>): Promise<Farmer>;
  getFarmers(): Promise<Farmer[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(filters?: { categoryId?: number; farmerId?: number; search?: string }): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  
  // Cart operations
  getCartItems(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem>;
  removeFromCart(id: number): Promise<void>;
  clearCart(userId: string): Promise<void>;
  
  // Order operations
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(userId?: string, farmerId?: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order>;
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Review operations
  getReviews(productId?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByEmailAndPassword(email: string, password: string): Promise<User | undefined> {
    const [user] = await db
      .select()
      .from(users)
      .where(
        and(
          eq(users.email, email),
          eq(users.password, password)
        )
      );
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const now = Math.floor(Date.now() / 1000);
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: now,
        },
      })
      .returning();
    return user;
  }

  // Farmer operations
  async getFarmer(id: number): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.id, id));
    return farmer;
  }

  async getFarmerByUserId(userId: string): Promise<Farmer | undefined> {
    const [farmer] = await db.select().from(farmers).where(eq(farmers.userId, userId));
    return farmer;
  }

  async createFarmer(farmer: InsertFarmer): Promise<Farmer> {
    const [newFarmer] = await db.insert(farmers).values(farmer).returning();
    return newFarmer;
  }

  async updateFarmer(id: number, farmer: Partial<InsertFarmer>): Promise<Farmer> {
    const now = Math.floor(Date.now() / 1000);
    const [updatedFarmer] = await db
      .update(farmers)
      .set({ ...farmer, updatedAt: now })
      .where(eq(farmers.id, id))
      .returning();
    return updatedFarmer;
  }

  async getFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers);
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return sqlite.prepare("SELECT * FROM categories ORDER BY name ASC").all() as Category[];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Product operations
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getProducts(filters?: { categoryId?: number; farmerId?: number; search?: string }): Promise<Product[]> {
    const conditions = [];
    
    if (filters?.categoryId) {
      conditions.push(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.farmerId) {
      conditions.push(eq(products.farmerId, filters.farmerId));
    }
    
    if (filters?.search) {
      const searchTerm = `%${filters.search}%`;
      conditions.push(
        or(
          like(products.name, searchTerm),
          like(sql`lower(${products.description})`, searchTerm)
        )
      );
    }
    
    const query = db.select().from(products);
    if (conditions.length > 0) {
      return await query.where(and(...conditions)).orderBy(desc(products.createdAt)).all();
    }
    return await query.orderBy(desc(products.createdAt)).all();
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const now = Math.floor(Date.now() / 1000);
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: now })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cart).where(eq(cart.userId, userId));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    const [existingItem] = await db
      .select()
      .from(cart)
      .where(
        and(
          eq(cart.userId, cartItem.userId),
          eq(cart.productId, cartItem.productId)
        )
      );

    if (existingItem) {
      const [updatedItem] = await db
        .update(cart)
        .set({ quantity: existingItem.quantity + (cartItem.quantity || 1) })
        .where(eq(cart.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      const [newItem] = await db.insert(cart).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cart)
      .set({ quantity })
      .where(eq(cart.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cart).where(eq(cart.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cart).where(eq(cart.userId, userId));
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrders(userId?: string, farmerId?: number): Promise<Order[]> {
    const conditions = [];
    
    if (userId) {
      conditions.push(eq(orders.userId, userId));
    }
    
    if (farmerId) {
      conditions.push(eq(orders.farmerId, farmerId));
    }
    
    if (conditions.length > 0) {
      return await db.select().from(orders).where(and(...conditions)).orderBy(desc(orders.createdAt)).all();
    }
    return await db.select().from(orders).orderBy(desc(orders.createdAt)).all();
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const { userId, farmerId, totalAmount, status, shippingAddress, phone } = order;
    const updateData: any = {};
    if (userId !== undefined) updateData.userId = userId;
    if (farmerId !== undefined) updateData.farmerId = farmerId;
    if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
    if (status !== undefined) updateData.status = status;
    if (shippingAddress !== undefined) updateData.shippingAddress = shippingAddress;
    if (phone !== undefined) updateData.phone = phone;
    
    const [updatedOrder] = await db
      .update(orders)
      .set(updateData)
      .where(eq(orders.id, id))
      .returning();
    return updatedOrder;
  }

  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const [newOrderItem] = await db.insert(orderItems).values(orderItem).returning();
    return newOrderItem;
  }

  // Review operations
  async getReviews(productId?: number): Promise<Review[]> {
    if (productId) {
      return await db
        .select()
        .from(reviews)
        .where(eq(reviews.productId, productId))
        .orderBy(desc(reviews.createdAt))
        .all();
    }
    return await db.select().from(reviews).orderBy(desc(reviews.createdAt)).all();
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
}

export const storage = new DatabaseStorage();