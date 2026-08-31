import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { normalizeEmail } from "./utils";

export async function verifyAdminCredentials(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email: normalizeEmail(email) } });
  if (!admin) return null;
  const ok = await bcrypt.compare(password, admin.passwordHash);
  return ok ? admin : null;
}
export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}
