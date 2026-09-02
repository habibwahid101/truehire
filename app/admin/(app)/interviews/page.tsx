import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { adminInterviews } from "@/lib/admin-data";
import { formatDateTime } from "@/lib/utils";
export const metadata = { title: "Interviews" };
export default async function InterviewsPage({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
  const view = (await searchParams).view || "upcoming";
  const interviews = await adminInterviews(view);
  return (
    <div>
      <p className="kicker">Schedule</p>
      <h1 className="serif mt-2 text-3xl">Interviews</h1>
      <div className="mt-4 flex gap-4 text-sm">
        <Link href="/admin/interviews?view=today" className={view === "today" ? "text-brand" : "text-muted"}>Today</Link>
        <Link href="/admin/interviews?view=upcoming" className={view === "upcoming" ? "text-brand" : "text-muted"}>Upcoming</Link>
        <Link href="/admin/interviews?view=past" className={view === "past" ? "text-brand" : "text-muted"}>Past</Link>
      </div>
      {interviews.length === 0 ? <div className="mt-8"><EmptyState title="No interviews in this view" body="Change the view or schedule an interview from a candidate record." /></div> : (
        <div className="panel table-wrap mt-6">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-faint"><tr><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Role</th><th className="px-4 py-3">When</th><th className="px-4 py-3">Mode</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody>{interviews.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3"><Link href={`/admin/applications/${item.applicationId}`} className="font-medium">{item.application.candidateName}</Link></td>
                <td className="px-4 py-3 text-muted">{item.application.job.title}<div>{item.application.job.company.name}</div></td>
                <td className="px-4 py-3">{formatDateTime(item.scheduledAt)}</td>
                <td className="px-4 py-3">{item.mode.replaceAll("_", " ").toLowerCase()}</td>
                <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
