import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  const basePath = process.env.BASE_PATH || "";

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  if (basePath) {
    // Serve variants FIRST with priority
    app.use(basePath + "/variants", express.static(path.join(staticPath, "variants"), {
      index: 'index.html',
      extensions: ['html']
    }));
    
    // Serve other static files
    app.use(basePath, express.static(staticPath));
    
    // Handle client-side routing - serve SPA index.html for React routes only
    app.get(basePath + "*", (_req, res) => {
      // Don't intercept variants paths - they're already handled by static middleware
      if (_req.path.includes('/variants')) {
        // If we got here, file wasn't found - proper 404
        return res.status(404).send('Variant not found');
      }
      // Serve React SPA for all other paths
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    // Serve variants FIRST
    app.use("/variants", express.static(path.join(staticPath, "variants"), {
      index: 'index.html',
      extensions: ['html']
    }));
    
    app.use(express.static(staticPath));
    
    // Handle client-side routing
    app.get("*", (_req, res) => {
      if (_req.path.includes('/variants')) {
        return res.status(404).send('Variant not found');
      }
      res.sendFile(path.join(staticPath, "index.html"));
    });
  }

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}${basePath}/`);
  });
}

startServer().catch(console.error);
