import { prisma } from "./db";
import { isJobOpen } from "./utils";

export async function listPublishedJobs(filters?: { q?: string; location?: string; employmentType?: string }) {
  const jobs = await prisma.job.findMany({
    where: {
      status: "PUBLISHED",
      ...(filters?.employmentType ? { employmentType: filters.employmentType as never } : {}),
      ...(filters?.location ? { location: { contains: filters.location, mode: "insensitive" } } : {}),
      ...(filters?.q
        ? {
            OR: [
              { title: { contains: filters.q, mode: "insensitive" } },
              { summary: { contains: filters.q, mode: "insensitive" } },
              { company: { name: { contains: filters.q, mode: "insensitive" } } },
            ],
          }
        : {}),
    },
    include: { company: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return jobs.filter((job) => isJobOpen(job));
}

export async function getPublishedJobBySlug(slug: string) {
  return prisma.job.findUnique({
    where: { slug },
    include: { company: true, questions: { orderBy: { sortOrder: "asc" } } },
  });
}
