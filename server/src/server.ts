import { app } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";

const connectDbWithRetry = async (attempt = 1): Promise<void> => {
  try {
    await connectDb();
  } catch (error) {
    const delayMs = Math.min(30000, attempt * 5000);
    const message = error instanceof Error ? error.message : String(error);
    if (message.includes("ENOTFOUND mongo")) {
      console.error("MongoDB connection failed because the hostname 'mongo' only exists in local Docker Compose. Set MONGO_URI, MONGO_URL, or DATABASE_URL to your Railway/Atlas MongoDB connection string.");
      return;
    }
    console.error(`MongoDB connection failed on attempt ${attempt}. Retrying in ${delayMs / 1000}s.`, error);
    setTimeout(() => {
      void connectDbWithRetry(attempt + 1);
    }, delayMs);
  }
};

app.listen(env.port, "0.0.0.0", () => {
  console.log(`API running on http://localhost:${env.port}`);
  void connectDbWithRetry();
});
