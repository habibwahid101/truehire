import { prisma } from "./db";
import { fixtureJobs, jobsWithCompany } from "./fixtures";
import { liveOrFixture } from "./review";
import { isJobOpen } from "./utils";

function matchFilters(
  jobs: ReturnType<typeof jobsWithCompany>,
  filters?: { q?: string; location?: string; employmentType?: string },
) {
  const q = filters?.q?.toLowerCase().trim();
  return jobs.filter((job) => {
    if (filters?.employmentType && job.employmentType !== filters.employmentType) return false;
    if (filters?.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (q && ![job.title, job.summary, job.company.name].some((v) => v.toLowerCase().includes(q))) return false;
    return true;
  });
}

export async function listPublishedJobs(filters?: { q?: string; location?: string; employmentType?: string }) {
  const live = async () => {
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
  };
  const fixtures = matchFilters(jobsWithCompany().filter((job) => isJobOpen(job)), filters);
  return liveOrFixture(live, fixtures);
}

export async function getPublishedJobBySlug(slug: string) {
  const live = async () =>
    prisma.job.findUnique({
      where: { slug },
      include: { company: true, questions: { orderBy: { sortOrder: "asc" } } },
    });
  const fixture = fixtureJobs.find((job) => job.slug === slug) || null;
  return liveOrFixture(live, fixture);
}

export async function getApplicationByReference(reference: string) {
  const live = async () =>
    prisma.application.findUnique({
      where: { publicReference: reference },
      include: { job: { include: { company: true } } },
    });
  const { applicationsHydrated } = await import("./fixtures");
  const fixture = applicationsHydrated().find((a) => a.publicReference === reference) || null;
  return liveOrFixture(live, fixture);
}
