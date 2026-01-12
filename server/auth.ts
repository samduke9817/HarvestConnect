import crypto from "crypto";
import session from "express-session";
import type { Express, Request, Response } from "express";
import { storage } from "./storage";
import type { User } from "@shared/schema-sqlite";

const SESSION_SECRET = process.env.SESSION_SECRET || "harvestconnect-secret-key-2024";

export function getSession() {
  return session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
  });
}

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password).digest("hex");
}

export async function setupAuth(app: Express) {
  app.use(getSession());

  // Register
  app.post("/api/auth/register", async (req: any, res: Response) => {
    try {
      console.log("Register request:", req.body);
      const { email, password, firstName, lastName, role = "consumer" } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        console.log("User already exists:", existingUser);
        return res.status(400).json({ message: "Email already registered" });
      }

      const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const hashedPassword = hashPassword(password);

      const userData: any = {
        id: userId,
        email,
        password: hashedPassword,
        firstName: firstName || "",
        lastName: lastName || "",
        role,
      };

      console.log("Creating user:", { ...userData, password: "***" });
      await storage.upsertUser(userData);

      req.session.userId = userId;
      req.session.userRole = role;

      res.json({ success: true, userId, role });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed", error });
    }
  });

  // Login
  app.post("/api/auth/login", async (req: any, res: Response) => {
    try {
      const { email, password } = req.body;
      console.log("Login request:", { email, passwordLength: password?.length });

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      const hashedPassword = hashPassword(password);
      console.log("Hashed password:", hashedPassword);

      const user = await storage.getUserByEmailAndPassword(email, hashedPassword);
      console.log("User found:", user ? "Yes" : "No");

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      req.session.userId = user.id;
      req.session.userRole = user.role;
      console.log("Session set:", req.session.userId, req.session.userRole);

      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed", error: String(error) });
    }
  });

  // Logout
  app.post("/api/auth/logout", (req: any, res: Response) => {
    req.session.destroy((err: any) => {
      if (err) {
        console.error("Logout error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/user", async (req: any, res: Response) => {
    try {
      console.log("Get user request, session:", req.session.userId, req.session.userRole);
      const userId = req.session.userId;
      if (!userId) {
        console.log("No userId in session");
        return res.status(401).json({ message: "Not authenticated" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        console.log("User not found:", userId);
        return res.status(404).json({ message: "User not found" });
      }

      const farmer = await storage.getFarmerByUserId(userId);
      console.log("Returning user:", user.email, user.role);

      res.json({ ...user, farmer });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });
}

export const isAuthenticated = async (req: any, res: Response, next: Function) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
