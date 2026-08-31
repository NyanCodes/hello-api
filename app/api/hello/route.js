import { NextResponse } from "next/server";

// GET /api/hello  ->  { "message": "hello world" }
export function GET() {
  return NextResponse.json(
    { message: "hello world" },
    {
      headers: {
        // Allow the React frontend (different origin/port) to read this response
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}
