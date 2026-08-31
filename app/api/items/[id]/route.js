import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";

const CORS = { "Access-Control-Allow-Origin": "*" };

async function getCollection() {
  const client = await clientPromise;
  const db = client.db("week10");
  return db.collection("items");
}

// PUT /api/items/:id  -> update an item's fields (reference pattern for modifying data).
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updates = {};
    if (typeof body.name === "string") updates.name = body.name.trim();
    if (typeof body.status === "string") updates.status = body.status; // e.g. "ACTIVE"
    updates.updatedAt = new Date();

    const collection = await getCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ ok: false, error: "item not found" }, { status: 404, headers: CORS });
    }
    return NextResponse.json({ ok: true, modified: result.modifiedCount }, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: CORS });
  }
}

// DELETE /api/items/:id  -> SOFT delete.
// Instead of removing the document, flip its status to "DELETED".
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const collection = await getCollection();

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "DELETED", deletedAt: new Date() } } // modify, don't remove
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ ok: false, error: "item not found" }, { status: 404, headers: CORS });
    }
    return NextResponse.json({ ok: true, softDeleted: true, modified: result.modifiedCount }, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500, headers: CORS });
  }
}
