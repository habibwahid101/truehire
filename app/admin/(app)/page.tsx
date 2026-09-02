import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default async function DashboardPage() {
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
  const metrics = [
    ["Active jobs", activeJobs, "/admin/jobs"],
    ["New applications", newApps, "/admin/applications?status=NEW"],
    ["Reviewing", reviewing, "/admin/applications?status=REVIEWING"],
    ["Shortlisted", shortlisted, "/admin/applications?status=SHORTLISTED"],
    ["Interviews", interviews, "/admin/interviews"],
    ["Selected", selected, "/admin/applications?status=SELECTED"],
  ] as const;

  return (
    <div>
      <h1 className="serif text-3xl">Recruitment desk</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map(([label, value, href]) => (
          <Link key={label} href={href} className="border border-line bg-surface p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-faint">{label}</p>
            <p className="mt-2 serif text-3xl">{value}</p>
          </Link>
        ))}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="serif text-2xl">Upcoming interviews</h2>
            <Link href="/admin/interviews" className="text-sm text-brand">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="border border-line bg-surface px-4 py-8 text-sm text-muted">No upcoming interviews.</p>
          ) : (
            <ul className="divide-y divide-line border border-line bg-surface">
              {upcoming.map((item) => (
                <li key={item.id} className="px-4 py-3 text-sm">
                  <Link href={`/admin/applications/${item.applicationId}`} className="font-medium">{item.application.candidateName}</Link>
                  <p className="text-muted">{item.application.job.title} · {item.application.job.company.name}</p>
                  <p className="text-muted">{formatDateTime(item.scheduledAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="serif text-2xl">Recent applications</h2>
            <Link href="/admin/applications" className="text-sm text-brand">View all</Link>
          </div>
          {recent.length === 0 ? (
            <p className="border border-line bg-surface px-4 py-8 text-sm text-muted">No applications yet.</p>
          ) : (
            <ul className="divide-y divide-line border border-line bg-surface">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div>
                    <Link href={`/admin/applications/${item.id}`} className="font-medium">{item.candidateName}</Link>
                    <p className="text-muted">{item.job.title} · {item.job.company.name}</p>
                  </div>
                  <StatusBadge value={item.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
