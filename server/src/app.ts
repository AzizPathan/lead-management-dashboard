import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { getDbStatus } from "./config/db.js";
import { authRoutes } from "./routes/authRoutes.js";
import { leadRoutes } from "./routes/leadRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.clientUrls.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked origin: ${origin}`));
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300 }));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    data: {
      name: "Smart Leads API",
      status: "running",
      endpoints: {
        health: "/health",
        auth: "/api/auth",
        leads: "/api/leads"
      }
    }
  });
});

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok", database: getDbStatus() } });
});

app.use("/api/auth", authRoutes);
app.use("/api/leads", leadRoutes);
app.use(notFound);
app.use(errorHandler);
