import Link from "next/link";
import { prisma } from "@/lib/db";
import { StatusBadge } from "@/components/ui/badge";
export const metadata = { title: "Companies" };
export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({ include: { _count: { select: { jobs: true } } }, orderBy: { name: "asc" } });
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <h1 className="serif text-3xl">Companies</h1>
        <Link href="/admin/companies/new" className="rounded-md bg-brand px-4 py-2 text-sm text-white">New company</Link>
      </div>
      {companies.length === 0 ? (
        <p className="mt-8 border border-line bg-surface px-4 py-10 text-sm text-muted">No companies yet. Create one before publishing a job.</p>
      ) : (
        <div className="mt-6 overflow-x-auto border border-line bg-surface">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-[0.12em] text-faint">
              <tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Jobs</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr key={company.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3"><Link href={`/admin/companies/${company.id}`} className="font-medium">{company.name}</Link></td>
                  <td className="px-4 py-3 text-muted">{company.location || "—"}</td>
                  <td className="px-4 py-3">{company._count.jobs}</td>
                  <td className="px-4 py-3"><StatusBadge value={company.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
