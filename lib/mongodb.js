import { MongoClient } from "mongodb";

// Connection string comes from .env.local  (MONGODB_URI=...)
const uri = process.env.MONGODB_URI;
const options = {};

if (!uri) {
  throw new Error("Please add your MongoDB connection string to .env.local as MONGODB_URI");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In dev, reuse the client across hot reloads so we don't open a new
  // connection on every change.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create one client per instance.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
