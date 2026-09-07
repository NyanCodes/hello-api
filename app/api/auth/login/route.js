import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { getClientPromise } from "@/lib/mongodb";
import corsHeaders, { isAllowedOrigin } from "@/lib/cors";
import { cookieOptions, getJwtSecret, publicUser } from "@/lib/auth";
import { errorResponse } from "@/lib/utils";
export { OPTIONS } from "@/lib/cors";
export async function POST(request) {
  if (!isAllowedOrigin(request)) return errorResponse("Origin not allowed", 403);
  let data;
  try { data = await request.json(); }
  catch { return errorResponse("Invalid JSON body", 400); }
  const { email, password } = data ?? {};
  if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password)
    return errorResponse("Missing email or password", 400);
  if (email.length > 254 || Buffer.byteLength(password, "utf8") > 72)
    return errorResponse("Invalid email or password", 400);
  try {
    const secret = getJwtSecret();
    let user;
    if (process.env.ADMIN_USER && email === process.env.ADMIN_USER) {
      if (process.env.ADMIN_PASS && password === process.env.ADMIN_PASS)
        user = { _id: "-1", email, username: "admin" };
    } else {
      const client = await getClientPromise();
      const candidate = await client.db(process.env.DB_NAME || "week10").collection("user").findOne({ email });
      if (candidate && typeof candidate.password === "string" && await bcrypt.compare(password, candidate.password)) user = candidate;
    }
    if (!user) return errorResponse("Invalid email or password", 401);
    const profile = publicUser(user);
    const token = jwt.sign(profile, secret, { algorithm: "HS256", expiresIn: "7d" });
    const response = NextResponse.json({ message: "Login successful", user: profile }, { headers: corsHeaders });
    response.cookies.set("token", token, cookieOptions());
    return response;
  } catch {
    return errorResponse("Login service unavailable. Check the server configuration.", 503);
  }
}
