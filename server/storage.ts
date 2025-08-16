import {
  users,
  farmers,
  categories,
  products,
  cartItems,
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
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, or, ilike, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
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
  getReviews(productId?: number, farmerId?: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
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
    const [updatedFarmer] = await db
      .update(farmers)
      .set({ ...farmer, updatedAt: new Date() })
      .where(eq(farmers.id, id))
      .returning();
    return updatedFarmer;
  }

  async getFarmers(): Promise<Farmer[]> {
    return await db.select().from(farmers).orderBy(desc(farmers.rating));
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories).orderBy(asc(categories.name));
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
    let query = db.select().from(products).where(eq(products.isActive, true));
    
    if (filters?.categoryId) {
      query = query.where(eq(products.categoryId, filters.categoryId));
    }
    
    if (filters?.farmerId) {
      query = query.where(eq(products.farmerId, filters.farmerId));
    }
    
    if (filters?.search) {
      query = query.where(
        or(
          ilike(products.name, `%${filters.search}%`),
          ilike(products.description, `%${filters.search}%`)
        )
      );
    }
    
    return await query.orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product> {
    const [updatedProduct] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<void> {
    await db.update(products).set({ isActive: false }).where(eq(products.id, id));
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItem[]> {
    return await db.select().from(cartItems).where(eq(cartItems.userId, userId));
  }

  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.userId, cartItem.userId),
          eq(cartItems.productId, cartItem.productId)
        )
      );

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + cartItem.quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Create new cart item
      const [newItem] = await db.insert(cartItems).values(cartItem).returning();
      return newItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrders(userId?: string, farmerId?: number): Promise<Order[]> {
    let query = db.select().from(orders);
    
    if (userId) {
      query = query.where(eq(orders.userId, userId));
    }
    
    if (farmerId) {
      // Get orders that contain products from this farmer
      query = query
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .where(eq(orderItems.farmerId, farmerId));
    }
    
    return await query.orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    return newOrder;
  }

  async updateOrder(id: number, order: Partial<InsertOrder>): Promise<Order> {
    const [updatedOrder] = await db
      .update(orders)
      .set({ ...order, updatedAt: new Date() })
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
  async getReviews(productId?: number, farmerId?: number): Promise<Review[]> {
    let query = db.select().from(reviews);
    
    if (productId) {
      query = query.where(eq(reviews.productId, productId));
    }
    
    if (farmerId) {
      query = query.where(eq(reviews.farmerId, farmerId));
    }
    
    return await query.orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db.insert(reviews).values(review).returning();
    return newReview;
  }
}

export const storage = new DatabaseStorage();
