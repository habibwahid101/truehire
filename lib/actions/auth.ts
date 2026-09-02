"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { clearSessionCookie, createSessionToken, setSessionCookie } from "@/lib/session";
import { loginSchema } from "@/lib/validation";

export type LoginActionState = { error?: string } | null;

export async function loginAction(_prev: LoginActionState, formData: FormData): Promise<LoginActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { error: "Enter a valid email and password." };
  if (!rateLimit(`login:${parsed.data.email}`, 8, 10 * 60 * 1000).ok) {
    return { error: "Too many sign-in attempts. Please wait a few minutes." };
  }
  const admin = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!admin) return { error: "Those credentials were not recognised." };
  await setSessionCookie(
    await createSessionToken({ sub: admin.id, email: admin.email, name: admin.name }),
  );
  const next = String(formData.get("next") || "/admin");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
