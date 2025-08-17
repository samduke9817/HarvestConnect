import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertFarmerSchema, 
  insertProductSchema, 
  insertCartItemSchema, 
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema,
  insertCategorySchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is a farmer
      const farmer = await storage.getFarmerByUserId(userId);
      
      res.json({ ...user, farmer });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Update user role
  app.patch('/api/auth/user/role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!['consumer', 'farmer', 'admin'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      const updatedUser = await storage.upsertUser({ role });
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user role:", error);
      res.status(500).json({ message: "Failed to update user role" });
    }
  });

  // Categories
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post('/api/categories', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Farmers
  app.get('/api/farmers', async (req, res) => {
    try {
      const farmers = await storage.getFarmers();
      res.json(farmers);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      res.status(500).json({ message: "Failed to fetch farmers" });
    }
  });

  app.get('/api/farmers/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const farmer = await storage.getFarmer(id);
      
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      
      res.json(farmer);
    } catch (error) {
      console.error("Error fetching farmer:", error);
      res.status(500).json({ message: "Failed to fetch farmer" });
    }
  });

  app.post('/api/farmers', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmerData = insertFarmerSchema.parse({ ...req.body, userId });
      
      const farmer = await storage.createFarmer(farmerData);
      
      // Update user role to farmer
      await storage.upsertUser({ role: 'farmer' });
      
      res.status(201).json(farmer);
    } catch (error) {
      console.error("Error creating farmer profile:", error);
      res.status(500).json({ message: "Failed to create farmer profile" });
    }
  });

  app.patch('/api/farmers/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmerId = parseInt(req.params.id);
      
      const farmer = await storage.getFarmer(farmerId);
      if (!farmer || farmer.userId !== userId) {
        return res.status(404).json({ message: "Farmer not found or unauthorized" });
      }
      
      const updateData = insertFarmerSchema.partial().parse(req.body);
      const updatedFarmer = await storage.updateFarmer(farmerId, updateData);
      
      res.json(updatedFarmer);
    } catch (error) {
      console.error("Error updating farmer:", error);
      res.status(500).json({ message: "Failed to update farmer" });
    }
  });

  // Products
  app.get('/api/products', async (req, res) => {
    try {
      const { categoryId, farmerId, search } = req.query;
      
      const filters = {
        categoryId: categoryId ? parseInt(categoryId as string) : undefined,
        farmerId: farmerId ? parseInt(farmerId as string) : undefined,
        search: search as string,
      };
      
      const products = await storage.getProducts(filters);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const farmer = await storage.getFarmerByUserId(userId);
      
      if (!farmer) {
        return res.status(403).json({ message: "Farmer profile required" });
      }
      
      const productData = insertProductSchema.parse({ ...req.body, farmerId: farmer.id });
      const product = await storage.createProduct(productData);
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.patch('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = parseInt(req.params.id);
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const farmer = await storage.getFarmer(product.farmerId);
      if (!farmer || farmer.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const updateData = insertProductSchema.partial().parse(req.body);
      const updatedProduct = await storage.updateProduct(productId, updateData);
      
      res.json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/products/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const productId = parseInt(req.params.id);
      
      const product = await storage.getProduct(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const farmer = await storage.getFarmer(product.farmerId);
      if (!farmer || farmer.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      await storage.deleteProduct(productId);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Cart
  app.get('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItems = await storage.getCartItems(userId);
      res.json(cartItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  app.post('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const cartItemData = insertCartItemSchema.parse({ ...req.body, userId });
      
      const cartItem = await storage.addToCart(cartItemData);
      res.status(201).json(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).json({ message: "Failed to add to cart" });
    }
  });

  app.patch('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      const cartItemId = parseInt(req.params.id);
      const { quantity } = req.body;
      
      if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Invalid quantity" });
      }
      
      const updatedItem = await storage.updateCartItem(cartItemId, quantity);
      res.json(updatedItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete('/api/cart/:id', isAuthenticated, async (req: any, res) => {
    try {
      const cartItemId = parseInt(req.params.id);
      await storage.removeFromCart(cartItemId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing from cart:", error);
      res.status(500).json({ message: "Failed to remove from cart" });
    }
  });

  app.delete('/api/cart', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.clearCart(userId);
      res.status(204).send();
    } catch (error) {
      console.error("Error clearing cart:", error);
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Orders
  app.get('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let orders;
      if (user?.role === 'farmer') {
        const farmer = await storage.getFarmerByUserId(userId);
        orders = farmer ? await storage.getOrders(undefined, farmer.id) : [];
      } else {
        orders = await storage.getOrders(userId);
      }
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      const orderItems = await storage.getOrderItems(orderId);
      res.json({ ...order, items: orderItems });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post('/api/orders', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const orderData = insertOrderSchema.parse({ ...req.body, userId });
      
      const order = await storage.createOrder(orderData);
      
      // Create order items from cart
      const cartItems = await storage.getCartItems(userId);
      
      for (const item of cartItems) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          await storage.createOrderItem({
            orderId: order.id,
            productId: item.productId,
            farmerId: product.farmerId,
            quantity: item.quantity,
            unitPrice: product.price,
            totalPrice: String(parseFloat(product.price) * item.quantity),
          });
        }
      }
      
      // Clear cart after creating order
      await storage.clearCart(userId);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.patch('/api/orders/:id', isAuthenticated, async (req: any, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const updateData = insertOrderSchema.partial().parse(req.body);
      
      const updatedOrder = await storage.updateOrder(orderId, updateData);
      res.json(updatedOrder);
    } catch (error) {
      console.error("Error updating order:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Reviews
  app.get('/api/reviews', async (req, res) => {
    try {
      const { productId, farmerId } = req.query;
      
      const reviews = await storage.getReviews(
        productId ? parseInt(productId as string) : undefined,
        farmerId ? parseInt(farmerId as string) : undefined
      );
      
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({ ...req.body, userId });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // Mock M-Pesa payment endpoint
  app.post('/api/payments/mpesa', isAuthenticated, async (req: any, res) => {
    try {
      const { amount, phoneNumber, orderId } = req.body;
      
      if (!amount || !phoneNumber || !orderId) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      
      // Mock M-Pesa payment processing
      const paymentReference = `MP${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
      
      // Simulate payment processing delay
      setTimeout(async () => {
        try {
          // Update order payment status
          await storage.updateOrder(orderId, {
            paymentStatus: 'paid',
            paymentMethod: 'mpesa',
            paymentReference,
            status: 'confirmed',
          });
        } catch (error) {
          console.error("Error updating order payment:", error);
        }
      }, 2000);
      
      res.json({
        success: true,
        paymentReference,
        message: 'Payment initiated successfully',
      });
    } catch (error) {
      console.error("Error processing M-Pesa payment:", error);
      res.status(500).json({ message: "Failed to process payment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
