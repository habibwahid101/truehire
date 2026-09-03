import { EMPLOYMENT_TYPES, type EmploymentTypeValue } from "./constants";
import { prisma } from "./db";
import { applicationsHydrated, fixtureJobs, jobsWithCompany } from "./fixtures";
import { liveOrFixture } from "./review";
import type { AdminPublicApplication, AdminPublicJob } from "./review-types";
import { mapAdminJob, mapPublicApplication } from "./ui-map";
import { isJobOpen } from "./utils";

function asEmploymentType(value?: string): EmploymentTypeValue | undefined {
  return EMPLOYMENT_TYPES.includes(value as EmploymentTypeValue) ? (value as EmploymentTypeValue) : undefined;
}

function matchFilters(
  jobs: AdminPublicJob[],
  filters?: { q?: string; location?: string; employmentType?: string },
) {
  const q = filters?.q?.toLowerCase().trim();
  return jobs.filter((job) => {
    if (filters?.employmentType && job.employmentType !== filters.employmentType) return false;
    if (filters?.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (q && ![job.title, job.summary, job.company.name].some((value) => value.toLowerCase().includes(q))) return false;
    return true;
  });
}

export async function listPublishedJobs(filters?: {
  q?: string;
  location?: string;
  employmentType?: string;
}): Promise<AdminPublicJob[]> {
  const live = async (): Promise<AdminPublicJob[]> => {
    const employmentType = asEmploymentType(filters?.employmentType);
    const jobs = await prisma.job.findMany({
      where: {
        status: "PUBLISHED",
        ...(employmentType ? { employmentType } : {}),
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
      include: { company: true, questions: { orderBy: { sortOrder: "asc" } } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return jobs.filter((job) => isJobOpen(job)).map((job) => mapAdminJob(job));
  };
  return liveOrFixture(live, matchFilters(jobsWithCompany().filter((job) => isJobOpen(job)), filters));
}

export async function getPublishedJobBySlug(slug: string): Promise<AdminPublicJob | null> {
  const live = async (): Promise<AdminPublicJob | null> => {
    const job = await prisma.job.findUnique({
      where: { slug },
      include: { company: true, questions: { orderBy: { sortOrder: "asc" } } },
    });
    return job ? mapAdminJob(job) : null;
  };
  return liveOrFixture(live, fixtureJobs.find((job) => job.slug === slug) ?? null);
}

export async function getApplicationByReference(reference: string): Promise<AdminPublicApplication | null> {
  const live = async (): Promise<AdminPublicApplication | null> => {
    const row = await prisma.application.findUnique({
      where: { publicReference: reference },
      include: { job: { include: { company: true } } },
    });
    return row ? mapPublicApplication(row) : null;
  };
  const fixture = applicationsHydrated().find((app) => app.publicReference === reference);
  return liveOrFixture(
    live,
    fixture
      ? {
          publicReference: fixture.publicReference,
          candidateName: fixture.candidateName,
          submittedAt: fixture.submittedAt,
          job: { title: fixture.job.title, company: { name: fixture.job.company.name } },
        }
      : null,
  );
}
