import { NextResponse } from "next/server";
import { verifyJWT } from "@/lib/auth";
import corsHeaders from "@/lib/cors";
import { errorResponse } from "@/lib/utils";
export { OPTIONS } from "@/lib/cors";
export function GET(request) {
  const user = verifyJWT(request);
  if (!user) return errorResponse("Unauthorized Request", 401);
  return NextResponse.json({ user }, { headers: corsHeaders });
}
