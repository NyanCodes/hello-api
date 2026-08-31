import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET /api/testing
// Inserts a test document into MongoDB, then returns all documents.
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("week10"); // database name
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
    });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }
}
