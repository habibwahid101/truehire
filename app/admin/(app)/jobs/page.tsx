import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { adminJobs } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
export const metadata = { title: "Jobs" };
export default async function AdminJobsPage() {
  const jobs = await adminJobs();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div><p className="kicker">Roles</p><h1 className="serif mt-2 text-3xl">Jobs</h1></div>
        <Link href="/admin/jobs/new" className="rounded-md bg-brand px-4 py-2 text-sm text-white">New job</Link>
      </div>
      {jobs.length === 0 ? <div className="mt-8"><EmptyState title="No jobs yet" body="Create a company first, then add a role." /></div> : (
        <div className="panel table-wrap mt-6">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-faint"><tr><th className="px-4 py-3">Job</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Applications</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody>{jobs.map((job) => (
              <tr key={job.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3"><Link href={`/admin/jobs/${job.id}`} className="font-medium">{job.title}</Link></td>
                <td className="px-4 py-3 text-muted">{job.company.name}</td>
                <td className="px-4 py-3 text-muted">{formatDate(job.applicationDeadline)}</td>
                <td className="px-4 py-3">{job._count?.applications ?? 0}</td>
                <td className="px-4 py-3"><StatusBadge value={job.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
