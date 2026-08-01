import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { setupRoutes } from "./src/routes/index.js";

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const allowedOrigins = [
    process.env.CORS_ORIGIN,
    process.env.FRONTEND_URL,
    process.env.VITE_API_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://nsamerenetamjong.vercel.app",
    "https://nsamerenetamjong.com",
    "https://www.nsamerenetamjong.com",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          callback(null, true);
          return;
        }

        if (
          allowedOrigins.includes(origin) ||
          /https:\/\/.*\.vercel\.app$/i.test(origin) ||
          /https:\/\/.*\.vercel\.dev$/i.test(origin) ||
          /http:\/\/localhost(:\d+)?$/i.test(origin) ||
          /http:\/\/127\.0\.0\.1(:\d+)?$/i.test(origin)
        ) {
          callback(null, true);
          return;
        }

        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      },
      credentials: true,
    })
  );
  app.use(express.json());
  app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

  setupRoutes(app);

  const frontendDistPath = path.resolve(process.cwd(), "../frontend/dist");
  if (fs.existsSync(frontendDistPath)) {
    app.use(express.static(frontendDistPath));
    app.get("*all", (_req, res) => {
      res.sendFile(path.join(frontendDistPath, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.json({ message: "Portfolio API is running" });
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

startServer();
