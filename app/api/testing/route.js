import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import { requireUser } from "@/lib/auth";
import CORS from "@/lib/cors";
export { OPTIONS } from "@/lib/cors";

// GET /api/testing
// Inserts a test document into MongoDB, then returns all documents.
export async function GET(request) {
  const denied = requireUser(request);
  if (denied) return denied;
  try {
    const client = await getClientPromise();
    const db = client.db(process.env.DB_NAME || "week10"); // database name
    const collection = db.collection("testing"); // collection name

    // 1) Insert a test document
    const testDoc = { message: "hello world", createdAt: new Date() };
    const result = await collection.insertOne(testDoc);

    // 2) Read every document back out
    const documents = await collection.find({}).toArray();

    return NextResponse.json({
      ok: true,
      insertedId: result.insertedId,
      count: documents.length,
      documents,
    }, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: CORS });
  }
}
