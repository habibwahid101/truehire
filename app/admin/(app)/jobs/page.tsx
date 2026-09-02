import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
export const metadata = { title: "Jobs" };
export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({ include: { company: true, _count: { select: { applications: true } } }, orderBy: { updatedAt: "desc" } });
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="serif text-3xl">Jobs</h1>
        <Link href="/admin/jobs/new" className="rounded-md bg-brand px-4 py-2 text-sm text-white">New job</Link>
      </div>
      {jobs.length === 0 ? (
        <p className="mt-8 border border-line bg-surface px-4 py-10 text-sm text-muted">No jobs yet. Create a company first, then add a role.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
              <tr><th className="px-4 py-3">Job</th><th className="px-4 py-3">Company</th><th className="px-4 py-3">Deadline</th><th className="px-4 py-3">Applications</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3"><Link href={`/admin/jobs/${job.id}`} className="font-medium">{job.title}</Link></td>
                  <td className="px-4 py-3 text-muted">{job.company.name}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(job.applicationDeadline)}</td>
                  <td className="px-4 py-3">{job._count.applications}</td>
                  <td className="px-4 py-3"><StatusBadge value={job.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
