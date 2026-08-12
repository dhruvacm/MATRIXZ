import mongoose from "mongoose";
import { env } from "./env";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(env.mongodbUri);
    // eslint-disable-next-line no-console
    console.log("[db] MongoDB connected");
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[db] MongoDB connection failed", error);
    process.exit(1);
  }
}
