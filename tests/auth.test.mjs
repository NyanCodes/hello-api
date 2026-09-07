import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

const base = process.env.AUTH_TEST_API_URL || "http://localhost:3000";
const origin = process.env.FRONTEND_ORIGIN || "http://localhost:5173";
const request = (path, options = {}) => fetch(`${base}${path}`, options);

test("authentication and credential-aware CORS", async () => {
  assert.ok(process.env.ADMIN_USER && process.env.ADMIN_PASS, "Set ADMIN_USER and ADMIN_PASS first");
  let response = await request("/api/me");
  assert.equal(response.status, 401);
  response = await request("/api/items");
  assert.equal(response.status, 401);
  for (const path of ["/api/auth/login", "/api/auth/logout", "/api/me", "/api/items", "/api/items/000000000000000000000000"]) {
    response = await request(path, { method: "OPTIONS", headers: { Origin: origin,
      "Access-Control-Request-Method": "POST", "Access-Control-Request-Headers": "Content-Type" } });
    assert.equal(response.status, 204);
    assert.equal(response.headers.get("access-control-allow-origin"), origin);
    assert.equal(response.headers.get("access-control-allow-credentials"), "true");
    assert.match(response.headers.get("access-control-allow-methods"), /DELETE/);
  }
  const login = (body, requestOrigin = origin) => request("/api/auth/login", {
    method: "POST", headers: { Origin: requestOrigin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  response = await login({});
  assert.equal(response.status, 400);
  response = await login({ email: { $ne: null }, password: "bad" });
  assert.equal(response.status, 400);
  response = await request("/api/auth/login", { method: "POST", body: "{" });
  assert.equal(response.status, 400);
  response = await login({ email: process.env.ADMIN_USER, password: `${process.env.ADMIN_PASS}wrong` });
  assert.equal(response.status, 401);
  response = await login({ email: process.env.ADMIN_USER, password: process.env.ADMIN_PASS }, "https://untrusted.example");
  assert.equal(response.status, 403);
  response = await login({ email: process.env.ADMIN_USER, password: process.env.ADMIN_PASS });
  assert.equal(response.status, 200);
  const data = await response.json();
  assert.equal(data.user.id, "-1");
  assert.equal(data.user.password, undefined);
  const setCookie = response.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i);
  assert.match(setCookie, /Max-Age=604800/i);
  const cookie = setCookie.split(";")[0];
  response = await request("/api/me", { headers: { Cookie: cookie } });
  assert.equal(response.status, 200);
  assert.deepEqual((await response.json()).user, data.user);
  response = await request("/api/me", { headers: { Cookie: "token=invalid" } });
  assert.equal(response.status, 401);
  const expired = jwt.sign(data.user, process.env.JWT_SECRET, { expiresIn: -1 });
  response = await request("/api/me", { headers: { Cookie: `token=${expired}` } });
  assert.equal(response.status, 401);
  response = await request("/api/auth/logout", { method: "POST", headers: { Origin: origin, Cookie: cookie } });
  assert.equal(response.status, 200);
  assert.match(response.headers.get("set-cookie"), /Max-Age=0/i);
  response = await request("/api/me");
  assert.equal(response.status, 401);
});
