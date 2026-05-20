import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDb = async (): Promise<void> => {
  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);
  await mongoose.connect(env.mongoUri, {
    serverSelectionTimeoutMS: 8000
  });
  console.log("MongoDB connected");
};

export const getDbStatus = (): string => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] ?? "unknown";
};

export const isDbConnected = (): boolean => mongoose.connection.readyState === 1;
