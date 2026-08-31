import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "./constants";

export type AdminSession = { sub: string; email: string; name: string };

function secret() {
  const value = process.env.AUTH_SECRET;
  if (!value || value.length < 16) throw new Error("AUTH_SECRET must be set to at least 16 characters.");
  return new TextEncoder().encode(value);
}
export async function createSessionToken(session: AdminSession) {
  return new SignJWT(session).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(`${SESSION_TTL_SECONDS}s`).sign(secret());
}
export async function readSessionToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (!payload.sub || !payload.email || !payload.name) return null;
    return { sub: String(payload.sub), email: String(payload.email), name: String(payload.name) };
  } catch {
    return null;
  }
}
export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return token ? readSessionToken(token) : null;
}
export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}
export async function setSessionCookie(token: string) {
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_TTL_SECONDS,
  });
}
export async function clearSessionCookie() {
  (await cookies()).set(SESSION_COOKIE, "", {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0,
  });
}
