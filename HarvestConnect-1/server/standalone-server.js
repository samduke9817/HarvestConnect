const express = require("express");
const path = require("path");
const fs = require("fs");
const path = require("path");
const fs = require("fs");

const PORT = process.env.PORT || 5000;

async function startServer() {
  const app = express();

  // Serve static files from client/build directory
  const clientDistPath = path.resolve(__dirname, "client", "dist");
  
  if (fs.existsSync(clientDistPath)) {
    console.log(`Serving static files from: ${clientDistPath}`);
    
    // Serve index.html for SPA
    app.get("/", (req, res) => {
      const indexPath = path.join(clientDistPath, "index.html");
      res.sendFile(indexPath);
    });
    
    // Serve all other static files
    app.use(express.static(clientDistPath));
  } else {
    console.error("Build directory not found:", clientDistPath);
    console.error("Please run 'npm run build' first to build: client");
    process.exit(1);
  }

  // Start server
  app.listen(PORT, () => {
    console.log("\n========================================");
    console.log("   HARVEST CONNECT SERVER");
    console.log("========================================");
    console.log(`Server running at: http://localhost:${PORT}`);
    console.log("Press Ctrl+C to stop");
    console.log("========================================\n");
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
