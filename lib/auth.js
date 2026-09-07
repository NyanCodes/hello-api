import jwt from "jsonwebtoken";
import { isAllowedOrigin } from "./cors";
import { errorResponse } from "./utils";
export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) throw new Error("Set JWT_SECRET to at least 32 random characters");
  return secret;
}
export function publicUser(user) {
  return { id: String(user._id ?? user.id), email: user.email, username: user.username };
}
export function verifyJWT(request) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return null;
    const user = jwt.verify(token, getJwtSecret(), { algorithms: ["HS256"] });
    if (typeof user !== "object" || typeof user.id !== "string" || typeof user.email !== "string") return null;
    return publicUser(user);
  } catch { return null; }
}
export function isAdmin(request) { return verifyJWT(request)?.id === "-1"; }
export function requireUser(request) {
  if (!isAllowedOrigin(request)) return errorResponse("Origin not allowed", 403);
  if (!verifyJWT(request)) return errorResponse("Unauthorized Request", 401);
  return null;
}
export function cookieOptions() {
  return { httpOnly: true, sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 };
}
