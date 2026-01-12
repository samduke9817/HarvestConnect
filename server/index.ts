import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

console.log('Starting Express server...');
console.log('Node version:', process.version);
console.log('Current directory:', process.cwd());

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  console.log('Starting server registration...');
  try {
    const server = await registerRoutes(app);
    console.log('Routes registered successfully');

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // For local development, skip Vite setup - it will run separately
    if (process.env.NODE_ENV !== "development") {
      console.log('Serving static files...');
      serveStatic(app);
    }

    // ALWAYS serve on app on the port specified in the environment variable PORT
    // other ports are firewalled.
    const port = parseInt(process.env.PORT || '3000', 10);
    console.log(`Attempting to listen on port ${port}...`);
    
    server.listen(port, 'localhost', () => {
      console.log(`✅ Server successfully started and serving on port ${port}`);
      console.log(`📍 API available at http://localhost:${port}/api/*`);
    });
    
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use!`);
        console.error(`   Please close the other application using port ${port}`);
        process.exit(1);
      } else {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
      }
    });
    
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
})();