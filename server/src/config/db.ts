import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDb = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(env.mongoUri);
  console.log("MongoDB connected");
};

export const getDbStatus = (): string => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] ?? "unknown";
};
