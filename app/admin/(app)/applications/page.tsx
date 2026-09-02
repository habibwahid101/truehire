import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { Input, Select } from "@/components/ui/field";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUSES } from "@/lib/constants";
import { adminApplications } from "@/lib/admin-data";
import { formatDate } from "@/lib/utils";
export const metadata = { title: "Applications" };
export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; job?: string; company?: string }> }) {
  const params = await searchParams;
  const [applications, jobs, companies] = await adminApplications(params);
  return (
    <div>
      <p className="kicker">Pipeline</p>
      <h1 className="serif mt-2 text-3xl">Applications</h1>
      <form className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5" method="get">
        <Input name="q" placeholder="Name, email, mobile, reference" defaultValue={params.q} />
        <Select name="status" defaultValue={params.status || ""}><option value="">All statuses</option>{APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}</Select>
        <Select name="job" defaultValue={params.job || ""}><option value="">All jobs</option>{jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}</Select>
        <Select name="company" defaultValue={params.company || ""}><option value="">All companies</option>{companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        <button className="h-[46px] rounded-md bg-brand text-sm text-white">Filter</button>
      </form>
      {applications.length === 0 ? <div className="mt-8"><EmptyState title="No matching applications" body="No applications match these filters." /></div> : (
        <div className="panel table-wrap mt-6">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-faint"><tr><th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Experience</th><th className="px-4 py-3">Expected</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody>{applications.map((item) => (
              <tr key={item.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3"><Link href={`/admin/applications/${item.id}`} className="font-medium">{item.candidateName}</Link><div className="text-muted">{item.publicReference}</div></td>
                <td className="px-4 py-3 text-muted">{item.job.title}<div>{item.job.company.name}</div></td>
                <td className="px-4 py-3">{String(item.totalExperienceYrs)} yrs</td>
                <td className="px-4 py-3">{item.expectedSalary ? `BDT ${item.expectedSalary}` : "—"}</td>
                <td className="px-4 py-3 text-muted">{formatDate(item.submittedAt)}</td>
                <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
