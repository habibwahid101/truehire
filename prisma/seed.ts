import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_BOOTSTRAP_EMAIL || "admin@truehire.local").toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || "change-me-now";
  const name = process.env.ADMIN_BOOTSTRAP_NAME || "TrueHire Admin";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });
  console.log(`Admin ready: ${email}`);
}

main().finally(() => prisma.$disconnect());
