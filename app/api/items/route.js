import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import { requireUser } from "@/lib/auth";
import CORS from "@/lib/cors";
export { OPTIONS } from "@/lib/cors";

async function getCollection() {
  const client = await getClientPromise();
  const db = client.db(process.env.DB_NAME || "week10");
  return db.collection("items");
}

// GET /api/items  -> list only items that are NOT soft-deleted.
export async function GET(request) {
  const denied = requireUser(request);
  if (denied) return denied;
  try {
    const collection = await getCollection();

    // Soft-delete filter: hide anything whose status is "DELETED".
    // Using $ne also keeps older docs that never had a status field.
    const items = await collection
      .find({ status: { $ne: "DELETED" } })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ ok: true, count: items.length, items }, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: CORS });
  }
}

// POST /api/items  -> create a new item, defaulting status to "ACTIVE".
export async function POST(request) {
  const denied = requireUser(request);
  if (denied) return denied;
  try {
    const body = await request.json();
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ ok: false, error: "name is required" }, { status: 400, headers: CORS });
    }

    const collection = await getCollection();
    const newItem = {
      name: body.name.trim(),
      status: "ACTIVE", // soft-delete flag; flipped to "DELETED" instead of removing
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newItem);
    return NextResponse.json({ ok: true, item: { _id: result.insertedId, ...newItem } }, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: CORS });
  }
}
