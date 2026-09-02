import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const metadata = { title: "Interviews" };

export default async function InterviewsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const view = (await searchParams).view || "upcoming";
  const now = new Date();
  const interviews = await prisma.interview.findMany({
    where: view === "past"
      ? { OR: [{ scheduledAt: { lt: now } }, { status: { in: ["CANCELLED", "ATTENDED", "NO_SHOW"] } }] }
      : view === "today"
        ? { scheduledAt: { gte: new Date(now.toDateString()), lt: new Date(now.getTime() + 24 * 60 * 60 * 1000) } }
        : { status: { in: ["SCHEDULED", "RESCHEDULED"] }, scheduledAt: { gte: now } },
    include: { application: { include: { job: { include: { company: true } } } } },
    orderBy: { scheduledAt: view === "past" ? "desc" : "asc" },
  });
  return (
    <div>
      <h1 className="serif text-3xl">Interviews</h1>
      <div className="mt-4 flex gap-3 text-sm">
        <Link href="/admin/interviews?view=today" className={view === "today" ? "text-brand" : "text-muted"}>Today</Link>
        <Link href="/admin/interviews?view=upcoming" className={view === "upcoming" ? "text-brand" : "text-muted"}>Upcoming</Link>
        <Link href="/admin/interviews?view=past" className={view === "past" ? "text-brand" : "text-muted"}>Past</Link>
      </div>
      {interviews.length === 0 ? (
        <p className="mt-8 border border-line bg-surface px-4 py-10 text-sm text-muted">No interviews in this view.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">When</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3"><Link href={`/admin/applications/${item.applicationId}`} className="font-medium">{item.application.candidateName}</Link></td>
                  <td className="px-4 py-3 text-muted">{item.application.job.title}<div>{item.application.job.company.name}</div></td>
                  <td className="px-4 py-3">{formatDateTime(item.scheduledAt)}</td>
                  <td className="px-4 py-3">{item.mode.replaceAll("_", " ").toLowerCase()}</td>
                  <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
