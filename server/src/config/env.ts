import dotenv from "dotenv";

dotenv.config();

const required = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback;
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
};

const isRailway = Object.keys(process.env).some((key) => key.startsWith("RAILWAY_"));
const mongoUri = process.env.MONGO_URI ?? process.env.MONGO_URL ?? process.env.DATABASE_URL ?? "mongodb://localhost:27017/smart-leads";

if (isRailway && mongoUri.includes("://mongo:27017")) {
  throw new Error("Railway cannot resolve the Docker Compose Mongo hostname 'mongo'. Set MONGO_URI to your Railway/Atlas MongoDB connection string.");
}

export const env = {
  port: Number(process.env.PORT ?? 5000),
  mongoUri,
  jwtSecret: required("JWT_SECRET", "dev-secret-change-me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  clientUrls: (process.env.CLIENT_URL ?? "http://localhost:5173")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean)
};
