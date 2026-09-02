import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { adminDashboard } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/utils";
export const metadata = { title: "Dashboard" };
export default async function DashboardPage() {
  const { activeJobs, newApps, reviewing, shortlisted, interviews, selected, upcoming, recent } = await adminDashboard();
  const metrics = [
    ["Active jobs", activeJobs, "/admin/jobs"],
    ["New", newApps, "/admin/applications?status=NEW"],
    ["Reviewing", reviewing, "/admin/applications?status=REVIEWING"],
    ["Shortlisted", shortlisted, "/admin/applications?status=SHORTLISTED"],
    ["Interviews", interviews, "/admin/interviews"],
    ["Selected", selected, "/admin/applications?status=SELECTED"],
  ] as const;
  return (
    <div>
      <p className="kicker">Operations</p>
      <h1 className="serif mt-2 text-3xl sm:text-4xl">Recruitment desk</h1>
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {metrics.map(([label, value, href]) => (
          <Link key={label} href={href} className="panel p-4">
            <p className="text-[11px] uppercase tracking-[0.14em] text-faint">{label}</p>
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
          {upcoming.length === 0 ? <EmptyState title="No upcoming interviews" body="Scheduled conversations will appear here." /> : (
            <ul className="panel divide-y divide-line">
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
          {recent.length === 0 ? <EmptyState title="No applications yet" body="New submissions will appear on this desk." /> : (
            <ul className="panel divide-y divide-line">
              {recent.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <div className="min-w-0">
                    <Link href={`/admin/applications/${item.id}`} className="font-medium">{item.candidateName}</Link>
                    <p className="truncate text-muted">{item.job.title} · {item.job.company.name}</p>
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
