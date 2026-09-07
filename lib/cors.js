import { NextResponse } from "next/server";
export const frontendOrigin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const corsHeaders = {
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Origin": frontendOrigin,
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
  Vary: "Origin",
  "Cache-Control": "no-store",
};
export default corsHeaders;
export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
export function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  return !origin || origin === frontendOrigin || origin === new URL(request.url).origin;
}
