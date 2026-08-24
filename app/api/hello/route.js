import { NextResponse } from "next/server";

// GET /api/hello  ->  { "message": "hello world" }
export function GET() {
  return NextResponse.json({ message: "hello world" });
}
