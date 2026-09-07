import { NextResponse } from "next/server";
import corsHeaders from "@/lib/cors";
export { OPTIONS } from "@/lib/cors";
export function GET() {
  return NextResponse.json({ message: "hello world" }, { headers: corsHeaders });
}
