import { NextResponse } from "next/server";
import corsHeaders, { isAllowedOrigin } from "@/lib/cors";
import { cookieOptions } from "@/lib/auth";
import { errorResponse } from "@/lib/utils";
export { OPTIONS } from "@/lib/cors";
export function POST(request) {
  if (!isAllowedOrigin(request)) return errorResponse("Origin not allowed", 403);
  const response = NextResponse.json({ message: "Logout successful" }, { headers: corsHeaders });
  response.cookies.set("token", "", { ...cookieOptions(), maxAge: 0 });
  return response;
}
// Course-compatible endpoint; the frontend uses POST for this state change.
export const GET = POST;
