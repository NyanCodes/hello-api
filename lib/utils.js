import { NextResponse } from "next/server";
import corsHeaders from "./cors";
export function errorResponse(message, status = 500) {
  return NextResponse.json({ ok: false, message, error: message }, { status, headers: corsHeaders });
}
