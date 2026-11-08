import mongoose from "mongoose";

let connection;

export async function connectDatabase() {
  if (connection) return connection;
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured");
  }
  connection = mongoose.connect(process.env.MONGODB_URI);
  await connection;
  return connection;
}
