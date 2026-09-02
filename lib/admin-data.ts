import { prisma } from "./db";
import { applicationsHydrated, fixtureCompanies, fixtureJobs, interviewsHydrated } from "./fixtures";
import { liveOrFixture } from "./review";

export async function adminDashboard() {
  const live = async () => {
    const [activeJobs, newApps, reviewing, shortlisted, interviews, selected, upcoming, recent] = await Promise.all([
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
    return { activeJobs, newApps, reviewing, shortlisted, interviews, selected, upcoming, recent };
  };
  const apps = applicationsHydrated();
  const upcoming = interviewsHydrated().filter((i) => ["SCHEDULED", "RESCHEDULED"].includes(i.status));
  return liveOrFixture(live, {
    activeJobs: fixtureJobs.filter((j) => j.status === "PUBLISHED").length,
    newApps: apps.filter((a) => a.status === "NEW").length,
    reviewing: apps.filter((a) => a.status === "REVIEWING").length,
    shortlisted: apps.filter((a) => a.status === "SHORTLISTED").length,
    interviews: apps.filter((a) => a.status === "INTERVIEW_SCHEDULED").length,
    selected: apps.filter((a) => a.status === "SELECTED").length,
    upcoming,
    recent: apps,
  });
}

export async function adminCompanies() {
  const live = async () => prisma.company.findMany({ include: { _count: { select: { jobs: true } } }, orderBy: { name: "asc" } });
  return liveOrFixture(live, fixtureCompanies);
}
export async function adminCompany(id: string) {
  const live = async () => prisma.company.findUnique({ where: { id } });
  return liveOrFixture(live, fixtureCompanies.find((c) => c.id === id) || null);
}
export async function adminJobs() {
  const live = async () => prisma.job.findMany({ include: { company: true, _count: { select: { applications: true } } }, orderBy: { updatedAt: "desc" } });
  return liveOrFixture(live, fixtureJobs.map((job) => ({ ...job, company: fixtureCompanies.find((c) => c.id === job.companyId)! })));
}
export async function adminJob(id: string) {
  const live = async () => prisma.job.findUnique({ where: { id }, include: { questions: { orderBy: { sortOrder: "asc" } } } });
  return liveOrFixture(live, fixtureJobs.find((j) => j.id === id) || null);
}
export async function adminApplications(filters: { q?: string; status?: string; job?: string; company?: string }) {
  const live = async () => {
    const where: Record<string, unknown> = {};
    if (filters.status) where.status = filters.status;
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
    return Promise.all([
      prisma.application.findMany({ where, include: { job: { include: { company: true } } }, orderBy: { submittedAt: "desc" }, take: 100 }),
      prisma.job.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
      prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    ]);
  };
  let apps = applicationsHydrated();
  if (filters.status) apps = apps.filter((a) => a.status === filters.status);
  if (filters.job) apps = apps.filter((a) => a.jobId === filters.job);
  if (filters.company) apps = apps.filter((a) => a.job.companyId === filters.company);
  if (filters.q) {
    const q = filters.q.toLowerCase();
    apps = apps.filter((a) => [a.candidateName, a.email, a.phone, a.publicReference].some((v) => String(v).toLowerCase().includes(q)));
  }
  return liveOrFixture(live, [apps, fixtureJobs.map((j) => ({ id: j.id, title: j.title })), fixtureCompanies.map((c) => ({ id: c.id, name: c.name }))] as const);
}
export async function adminApplication(id: string) {
  const live = async () => prisma.application.findUnique({
    where: { id },
    include: { job: { include: { company: true } }, answers: { include: { question: true } }, evaluation: true, interviews: { orderBy: { scheduledAt: "desc" } }, activities: { include: { actor: true }, orderBy: { createdAt: "desc" } } },
  });
  return liveOrFixture(live, applicationsHydrated().find((a) => a.id === id) || null);
}
export async function adminInterviews(view: string) {
  const live = async () => {
    const now = new Date();
    return prisma.interview.findMany({
      where: view === "past" ? { OR: [{ scheduledAt: { lt: now } }, { status: { in: ["CANCELLED", "ATTENDED", "NO_SHOW"] } }] } : view === "today" ? { scheduledAt: { gte: new Date(now.toDateString()), lt: new Date(now.getTime() + 86400000) } } : { status: { in: ["SCHEDULED", "RESCHEDULED"] }, scheduledAt: { gte: now } },
      include: { application: { include: { job: { include: { company: true } } } } },
      orderBy: { scheduledAt: view === "past" ? "desc" : "asc" },
    });
  };
  const items = interviewsHydrated();
  return liveOrFixture(live, view === "past" ? [] : items);
}
