import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { handleSuggestRate } from "./src/backend/api/suggestRateController";
import { handleSmartMatch } from "./src/backend/api/smartMatchController";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: AI Suggest Rate
  app.post("/api/suggest-rate", handleSuggestRate);

  // API Route: AI Smart Match
  app.post("/api/smart-match", handleSmartMatch);

  // Vite middleware for dev or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Skill Bridge server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
