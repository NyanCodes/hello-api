import { MongoClient } from "mongodb";
let clientPromise;
export function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("Set MONGODB_URI in .env.local");
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) global._mongoClientPromise = new MongoClient(uri).connect().catch(error => {
      global._mongoClientPromise = undefined;
      throw error;
    });
    return global._mongoClientPromise;
  }
  if (!clientPromise) clientPromise = new MongoClient(uri).connect().catch(error => {
    clientPromise = undefined;
    throw error;
  });
  return clientPromise;
}
