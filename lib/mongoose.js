import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Missing MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    try{
    cached.promise = mongoose
      .connect(MONGODB_URI)
      .then((mongoose) => {
        console.log("Connected to MongoDB🟢");
        return mongoose;
      });
    }
      catch(error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
      }
  }
  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectToDatabase;
