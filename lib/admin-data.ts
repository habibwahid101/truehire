import type { Prisma } from "@prisma/client";
import { APPLICATION_STATUSES, type ApplicationStatusValue } from "./constants";
import { prisma } from "./db";
import {
  applicationsHydrated,
  fixtureCompanies,
  fixtureJobs,
  interviewsHydrated,
} from "./fixtures";
import { liveOrFixture } from "./review";
import type {
  AdminApplicationDetail,
  AdminApplicationListItem,
  AdminCompanyItem,
  AdminDashboardData,
  AdminInterviewItem,
  AdminJobItem,
  AdminJobListItem,
} from "./review-types";
import {
  mapAdminApplicationDetail,
  mapAdminApplicationListItem,
  mapAdminCompany,
  mapAdminInterviewItem,
  mapAdminJob,
  mapAdminJobListItem,
  mapReviewApplicationToListItem,
} from "./ui-map";

function asApplicationStatus(value?: string): ApplicationStatusValue | undefined {
  return APPLICATION_STATUSES.includes(value as ApplicationStatusValue)
    ? (value as ApplicationStatusValue)
    : undefined;
}

export async function adminDashboard(): Promise<AdminDashboardData> {
  const live = async (): Promise<AdminDashboardData> => {
    const [activeJobs, newApps, reviewing, shortlisted, interviews, selected, upcomingRows, recentRows] = await Promise.all([
      prisma.job.count({ where: { status: "PUBLISHED" } }),
      prisma.application.count({ where: { status: "NEW" } }),
      prisma.application.count({ where: { status: "REVIEWING" } }),
      prisma.application.count({ where: { status: "SHORTLISTED" } }),
      prisma.application.count({ where: { status: "INTERVIEW_SCHEDULED" } }),
      prisma.application.count({ where: { status: "SELECTED" } }),
      prisma.interview.findMany({
        where: { status: { in: ["SCHEDULED", "RESCHEDULED"] }, scheduledAt: { gte: new Date() } },
        include: { application: { include: { job: { include: { company: true } } } } },
        orderBy: { scheduledAt: "asc" },
        take: 6,
      }),
      prisma.application.findMany({ include: { job: { include: { company: true } } }, orderBy: { submittedAt: "desc" }, take: 8 }),
    ]);
    return {
      activeJobs,
      newApps,
      reviewing,
      shortlisted,
      interviews,
      selected,
      upcoming: upcomingRows.map(mapAdminInterviewItem),
      recent: recentRows.map(mapAdminApplicationListItem),
    };
  };
  const apps = applicationsHydrated();
  const fixture: AdminDashboardData = {
    activeJobs: fixtureJobs.filter((job) => job.status === "PUBLISHED").length,
    newApps: apps.filter((app) => app.status === "NEW").length,
    reviewing: apps.filter((app) => app.status === "REVIEWING").length,
    shortlisted: apps.filter((app) => app.status === "SHORTLISTED").length,
    interviews: apps.filter((app) => app.status === "INTERVIEW_SCHEDULED").length,
    selected: apps.filter((app) => app.status === "SELECTED").length,
    upcoming: interviewsHydrated().filter((item) => item.status === "SCHEDULED" || item.status === "RESCHEDULED"),
    recent: apps.map(mapReviewApplicationToListItem),
  };
  return liveOrFixture(live, fixture);
}

export async function adminCompanies(): Promise<AdminCompanyItem[]> {
  const live = async (): Promise<AdminCompanyItem[]> => {
    const rows = await prisma.company.findMany({ include: { _count: { select: { jobs: true } } }, orderBy: { name: "asc" } });
    return rows.map(mapAdminCompany);
  };
  return liveOrFixture(live, fixtureCompanies);
}

export async function adminCompany(id: string): Promise<AdminCompanyItem | null> {
  const live = async (): Promise<AdminCompanyItem | null> => {
    const row = await prisma.company.findUnique({ where: { id } });
    return row ? mapAdminCompany(row) : null;
  };
  return liveOrFixture(live, fixtureCompanies.find((company) => company.id === id) ?? null);
}

export async function adminJobs(): Promise<AdminJobListItem[]> {
  const live = async (): Promise<AdminJobListItem[]> => {
    const rows = await prisma.job.findMany({
      include: { company: true, _count: { select: { applications: true } } },
      orderBy: { updatedAt: "desc" },
    });
    return rows.map(mapAdminJobListItem);
  };
  return liveOrFixture(
    live,
    fixtureJobs.map((job) => ({
      id: job.id,
      slug: job.slug,
      title: job.title,
      status: job.status,
      applicationDeadline: job.applicationDeadline,
      company: { id: job.company.id, name: job.company.name },
      _count: job._count,
    })),
  );
}

export async function adminJob(id: string): Promise<AdminJobItem | null> {
  const live = async (): Promise<AdminJobItem | null> => {
    const row = await prisma.job.findUnique({ where: { id }, include: { questions: { orderBy: { sortOrder: "asc" } }, company: true } });
    return row ? mapAdminJob(row) : null;
  };
  return liveOrFixture(live, fixtureJobs.find((job) => job.id === id) ?? null);
}

export async function adminApplications(filters: {
  q?: string;
  status?: string;
  job?: string;
  company?: string;
}): Promise<[AdminApplicationListItem[], { id: string; title: string }[], { id: string; name: string }[]]> {
  const live = async (): Promise<[AdminApplicationListItem[], { id: string; title: string }[], { id: string; name: string }[]]> => {
    const where: Prisma.ApplicationWhereInput = {};
    const status = asApplicationStatus(filters.status);
    if (status) where.status = status;
    if (filters.job) where.jobId = filters.job;
    if (filters.company) where.job = { companyId: filters.company };
    if (filters.q) {
      where.OR = [
        { candidateName: { contains: filters.q, mode: "insensitive" } },
        { email: { contains: filters.q, mode: "insensitive" } },
        { phone: { contains: filters.q, mode: "insensitive" } },
        { publicReference: { contains: filters.q, mode: "insensitive" } },
      ];
    }
    const [rows, jobs, companies] = await Promise.all([
      prisma.application.findMany({
        where,
        include: { job: { include: { company: true } } },
        orderBy: { submittedAt: "desc" },
        take: 100,
      }),
      prisma.job.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
      prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);
    return [rows.map(mapAdminApplicationListItem), jobs, companies];
  };
  let apps = applicationsHydrated();
  if (filters.status) apps = apps.filter((app) => app.status === filters.status);
  if (filters.job) apps = apps.filter((app) => app.jobId === filters.job);
  if (filters.company) apps = apps.filter((app) => app.job.companyId === filters.company);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    apps = apps.filter((app) =>
      [app.candidateName, app.email, app.phone, app.publicReference].some((value) => value.toLowerCase().includes(q)),
    );
  }
  return liveOrFixture(live, [
    apps.map(mapReviewApplicationToListItem),
    fixtureJobs.map((job) => ({ id: job.id, title: job.title })),
    fixtureCompanies.map((company) => ({ id: company.id, name: company.name })),
  ]);
}

export async function adminApplication(id: string): Promise<AdminApplicationDetail | null> {
  const live = async (): Promise<AdminApplicationDetail | null> => {
    const row = await prisma.application.findUnique({
      where: { id },
      include: {
        job: { include: { company: true } },
        answers: { include: { question: true } },
        evaluation: true,
        interviews: { orderBy: { scheduledAt: "desc" } },
        activities: { include: { actor: true }, orderBy: { createdAt: "desc" } },
      },
    });
    return row ? mapAdminApplicationDetail(row) : null;
  };
  return liveOrFixture(live, applicationsHydrated().find((app) => app.id === id) ?? null);
}

export async function adminInterviews(view: string): Promise<AdminInterviewItem[]> {
  const live = async (): Promise<AdminInterviewItem[]> => {
    const now = new Date();
    const rows = await prisma.interview.findMany({
      where: view === "past"
        ? { OR: [{ scheduledAt: { lt: now } }, { status: { in: ["CANCELLED", "ATTENDED", "NO_SHOW"] } }] }
        : view === "today"
          ? { scheduledAt: { gte: new Date(now.toDateString()), lt: new Date(now.getTime() + 86400000) } }
          : { status: { in: ["SCHEDULED", "RESCHEDULED"] }, scheduledAt: { gte: now } },
      include: { application: { include: { job: { include: { company: true } } } } },
      orderBy: { scheduledAt: view === "past" ? "desc" : "asc" },
    });
    return rows.map(mapAdminInterviewItem);
  };
  const items = interviewsHydrated();
  return liveOrFixture(live, view === "past" ? [] : items);
}
