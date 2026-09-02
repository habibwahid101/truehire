import Link from "next/link";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/field";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUSES } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Applications" };

export default async function ApplicationsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; status?: string; job?: string; company?: string }> }) {
  const params = await searchParams;
  const where: Prisma.ApplicationWhereInput = {};
  if (params.status) where.status = params.status as ApplicationStatus;
  if (params.job) where.jobId = params.job;
  if (params.company) where.job = { companyId: params.company };
  if (params.q) {
    where.OR = [
      { candidateName: { contains: params.q, mode: "insensitive" } },
      { email: { contains: params.q, mode: "insensitive" } },
      { phone: { contains: params.q, mode: "insensitive" } },
      { publicReference: { contains: params.q, mode: "insensitive" } },
    ];
  }
  const [applications, jobs, companies] = await Promise.all([
    prisma.application.findMany({ where, include: { job: { include: { company: true } } }, orderBy: { submittedAt: "desc" }, take: 100 }),
    prisma.job.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true } }),
    prisma.company.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
  ]);
  return (
    <div>
      <h1 className="serif text-3xl">Applications</h1>
      <form className="mt-6 grid gap-3 md:grid-cols-5" method="get">
        <Input name="q" placeholder="Name, email, mobile, reference" defaultValue={params.q} />
        <Select name="status" defaultValue={params.status || ""}>
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{APPLICATION_STATUS_LABELS[s]}</option>)}
        </Select>
        <Select name="job" defaultValue={params.job || ""}>
          <option value="">All jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.title}</option>)}
        </Select>
        <Select name="company" defaultValue={params.company || ""}>
          <option value="">All companies</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <button className="h-[46px] rounded-md bg-brand text-sm text-white">Filter</button>
      </form>
      {applications.length === 0 ? (
        <p className="mt-8 border border-line bg-surface px-4 py-10 text-sm text-muted">No applications match these filters.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
              <tr>
                <th className="px-4 py-3">Candidate</th><th className="px-4 py-3">Job</th><th className="px-4 py-3">Experience</th>
                <th className="px-4 py-3">Expected</th><th className="px-4 py-3">Applied</th><th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((item) => (
                <tr key={item.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/applications/${item.id}`} className="font-medium">{item.candidateName}</Link>
                    <div className="text-muted">{item.publicReference}</div>
                  </td>
                  <td className="px-4 py-3 text-muted">{item.job.title}<div>{item.job.company.name}</div></td>
                  <td className="px-4 py-3">{String(item.totalExperienceYrs)} yrs</td>
                  <td className="px-4 py-3">{item.expectedSalary ? `BDT ${item.expectedSalary}` : "—"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(item.submittedAt)}</td>
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
