import Link from "next/link";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { adminCompanies } from "@/lib/admin-data";
export const metadata = { title: "Companies" };
export default async function CompaniesPage() {
  const companies = await adminCompanies();
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <div><p className="kicker">Records</p><h1 className="serif mt-2 text-3xl">Companies</h1></div>
        <Link href="/admin/companies/new" className="rounded-md bg-brand px-4 py-2 text-sm text-white">New company</Link>
      </div>
      {companies.length === 0 ? <div className="mt-8"><EmptyState title="No companies yet" body="Create one before publishing a job." /></div> : (
        <div className="panel table-wrap mt-6">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-line text-[11px] uppercase tracking-[0.12em] text-faint"><tr><th className="px-4 py-3">Company</th><th className="px-4 py-3">Location</th><th className="px-4 py-3">Jobs</th><th className="px-4 py-3">Status</th></tr></thead>
            <tbody>{companies.map((company) => (
              <tr key={company.id} className="border-b border-line last:border-0">
                <td className="px-4 py-3"><Link href={`/admin/companies/${company.id}`} className="font-medium">{company.name}</Link></td>
                <td className="px-4 py-3 text-muted">{company.location || "—"}</td>
                <td className="px-4 py-3">{company._count?.jobs ?? 0}</td>
                <td className="px-4 py-3"><StatusBadge value={company.status} /></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
