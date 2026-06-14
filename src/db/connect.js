import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

export async function connectDB() {
  try {
    await client.connect();
    const db = client.db("globalfest");
    console.log("MongoDB connected");
    return db;
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
}

export default client;
