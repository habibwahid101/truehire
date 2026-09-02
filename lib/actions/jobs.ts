"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { JobStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdminSession } from "@/lib/session";
import { uniqueSlug } from "@/lib/utils";
import { jobSchema } from "@/lib/validation";

function readJobForm(formData: FormData) {
  const skills = String(formData.get("skills") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  let questions: unknown[] = [];
  try {
    questions = JSON.parse(String(formData.get("questions") || "[]"));
  } catch {
    questions = [];
  }
  return jobSchema.safeParse({
    companyId: formData.get("companyId"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    description: formData.get("description"),
    location: formData.get("location"),
    workplaceType: formData.get("workplaceType"),
    employmentType: formData.get("employmentType"),
    vacancyCount: formData.get("vacancyCount") || 1,
    salaryMin: formData.get("salaryMin") || undefined,
    salaryMax: formData.get("salaryMax") || undefined,
    salaryDisplay: formData.get("salaryDisplay"),
    salaryNegotiable: formData.get("salaryNegotiable") === "on",
    educationRequirement: formData.get("educationRequirement"),
    experienceRequirement: formData.get("experienceRequirement"),
    relevantExperience: formData.get("relevantExperience"),
    skills,
    responsibilities: formData.get("responsibilities"),
    preferredQualifications: formData.get("preferredQualifications"),
    benefits: formData.get("benefits"),
    workingDays: formData.get("workingDays"),
    workingHours: formData.get("workingHours"),
    probation: formData.get("probation"),
    joiningExpectation: formData.get("joiningExpectation"),
    applicationDeadline: formData.get("applicationDeadline"),
    terms: formData.get("terms"),
    instructions: formData.get("instructions"),
    requirePortfolio: formData.get("requirePortfolio") === "on",
    requireLinkedIn: formData.get("requireLinkedIn") === "on",
    questions,
  });
}

function jobFields(parsed: ReturnType<typeof jobSchema.parse>, slug: string): Prisma.JobUncheckedUpdateInput {
  return {
    companyId: parsed.companyId,
    slug,
    title: parsed.title,
    summary: parsed.summary,
    description: parsed.description,
    location: parsed.location,
    workplaceType: parsed.workplaceType,
    employmentType: parsed.employmentType,
    vacancyCount: parsed.vacancyCount,
    salaryMin: parsed.salaryMin ?? null,
    salaryMax: parsed.salaryMax ?? null,
    salaryDisplay: parsed.salaryDisplay || null,
    salaryNegotiable: parsed.salaryNegotiable,
    educationRequirement: parsed.educationRequirement || null,
    experienceRequirement: parsed.experienceRequirement || null,
    relevantExperience: parsed.relevantExperience || null,
    skills: parsed.skills,
    responsibilities: parsed.responsibilities,
    preferredQualifications: parsed.preferredQualifications || null,
    benefits: parsed.benefits || null,
    workingDays: parsed.workingDays || null,
    workingHours: parsed.workingHours || null,
    probation: parsed.probation || null,
    joiningExpectation: parsed.joiningExpectation || null,
    applicationDeadline: parsed.applicationDeadline ? new Date(parsed.applicationDeadline) : null,
    terms: parsed.terms || null,
    instructions: parsed.instructions || null,
    requirePortfolio: parsed.requirePortfolio,
    requireLinkedIn: parsed.requireLinkedIn,
  };
}

export async function createJobAction(formData: FormData) {
  await requireAdminSession();
  const parsed = readJobForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Please check the job details." };
  const existing = await prisma.job.findMany({ select: { slug: true } });
  const slug = uniqueSlug(parsed.data.slug || parsed.data.title, existing.map((j) => j.slug));
  const job = await prisma.job.create({
    data: {
      ...(jobFields(parsed.data, slug) as Prisma.JobUncheckedCreateInput),
      questions: {
        create: parsed.data.questions.map((q, index) => ({
          question: q.question,
          type: q.type,
          options: q.options || [],
          required: q.required,
          sortOrder: index,
        })),
      },
    },
  });
  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs/${job.id}`);
}

export async function updateJobAction(id: string, formData: FormData) {
  await requireAdminSession();
  const parsed = readJobForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Please check the job details." };
  const others = await prisma.job.findMany({ where: { id: { not: id } }, select: { slug: true } });
  const slug = uniqueSlug(parsed.data.slug || parsed.data.title, others.map((j) => j.slug));
  await prisma.$transaction(async (tx) => {
    await tx.job.update({ where: { id }, data: jobFields(parsed.data, slug) });
    await tx.jobQuestion.deleteMany({ where: { jobId: id, answers: { none: {} } } });
    const remaining = await tx.jobQuestion.findMany({ where: { jobId: id } });
    const remainingIds = new Set(remaining.map((q) => q.id));
    for (const [index, q] of parsed.data.questions.entries()) {
      if (q.id && remainingIds.has(q.id)) {
        await tx.jobQuestion.update({
          where: { id: q.id },
          data: { question: q.question, type: q.type, options: q.options || [], required: q.required, sortOrder: index },
        });
      } else {
        await tx.jobQuestion.create({
          data: {
            jobId: id,
            question: q.question,
            type: q.type,
            options: q.options || [],
            required: q.required,
            sortOrder: index,
          },
        });
      }
    }
  });
  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}`);
  revalidatePath("/jobs");
  revalidatePath("/");
  return { ok: true };
}

export async function setJobStatusAction(id: string, status: JobStatus) {
  await requireAdminSession();
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) return { error: "Job not found." };
  await prisma.job.update({
    where: { id },
    data: { status, publishedAt: status === "PUBLISHED" ? job.publishedAt ?? new Date() : job.publishedAt },
  });
  revalidatePath("/admin/jobs");
  revalidatePath(`/admin/jobs/${id}`);
  revalidatePath("/jobs");
  revalidatePath("/");
  return { ok: true };
}

export async function duplicateJobAction(id: string) {
  await requireAdminSession();
  const job = await prisma.job.findUnique({ where: { id }, include: { questions: true } });
  if (!job) return { error: "Job not found." };
  const existing = await prisma.job.findMany({ select: { slug: true } });
  const copy = await prisma.job.create({
    data: {
      companyId: job.companyId,
      slug: uniqueSlug(`${job.slug}-copy`, existing.map((j) => j.slug)),
      title: `${job.title} (Copy)`,
      summary: job.summary,
      description: job.description,
      location: job.location,
      workplaceType: job.workplaceType,
      employmentType: job.employmentType,
      vacancyCount: job.vacancyCount,
      salaryMin: job.salaryMin,
      salaryMax: job.salaryMax,
      salaryDisplay: job.salaryDisplay,
      salaryNegotiable: job.salaryNegotiable,
      educationRequirement: job.educationRequirement,
      experienceRequirement: job.experienceRequirement,
      relevantExperience: job.relevantExperience,
      skills: job.skills,
      responsibilities: job.responsibilities,
      preferredQualifications: job.preferredQualifications,
      benefits: job.benefits,
      workingDays: job.workingDays,
      workingHours: job.workingHours,
      probation: job.probation,
      joiningExpectation: job.joiningExpectation,
      applicationDeadline: job.applicationDeadline,
      terms: job.terms,
      instructions: job.instructions,
      requirePortfolio: job.requirePortfolio,
      requireLinkedIn: job.requireLinkedIn,
      status: "DRAFT",
      questions: {
        create: job.questions.map((q) => ({
          question: q.question,
          type: q.type,
          options: q.options,
          required: q.required,
          sortOrder: q.sortOrder,
        })),
      },
    },
  });
  revalidatePath("/admin/jobs");
  redirect(`/admin/jobs/${copy.id}`);
}
