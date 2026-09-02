"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/session";
import { uniqueSlug } from "@/lib/utils";
import { companySchema } from "@/lib/validation";

export async function createCompanyAction(formData: FormData) {
  await requireAdminSession();
  const parsed = companySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Please check the company details." };
  const existing = await prisma.company.findMany({ select: { slug: true } });
  const company = await prisma.company.create({
    data: {
      name: parsed.data.name,
      slug: uniqueSlug(parsed.data.slug || parsed.data.name, existing.map((c) => c.slug)),
      industry: parsed.data.industry || null,
      website: parsed.data.website || null,
      location: parsed.data.location || null,
      overview: parsed.data.overview || null,
      internalNotes: parsed.data.internalNotes || null,
      status: parsed.data.status,
    },
  });
  revalidatePath("/admin/companies");
  redirect(`/admin/companies/${company.id}`);
}

export async function updateCompanyAction(id: string, formData: FormData) {
  await requireAdminSession();
  const parsed = companySchema.safeParse(Object.fromEntries(formData.entries()));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Please check the company details." };
  const others = await prisma.company.findMany({ where: { id: { not: id } }, select: { slug: true } });
  await prisma.company.update({
    where: { id },
    data: {
      name: parsed.data.name,
      slug: uniqueSlug(parsed.data.slug || parsed.data.name, others.map((c) => c.slug)),
      industry: parsed.data.industry || null,
      website: parsed.data.website || null,
      location: parsed.data.location || null,
      overview: parsed.data.overview || null,
      internalNotes: parsed.data.internalNotes || null,
      status: parsed.data.status,
    },
  });
  revalidatePath("/admin/companies");
  revalidatePath(`/admin/companies/${id}`);
  return { ok: true };
}
