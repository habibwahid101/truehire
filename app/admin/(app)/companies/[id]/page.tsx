import { notFound } from "next/navigation";
import { updateCompanyAction } from "@/lib/actions/companies";
import { CompanyForm } from "@/components/admin/company-form";
import { adminCompany } from "@/lib/admin-data";
export const metadata = { title: "Company" };
export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const company = await adminCompany((await params).id);
  if (!company) notFound();
  return (
    <div>
      <p className="kicker">Company</p>
      <h1 className="serif mt-2 text-3xl">{company.name}</h1>
      <p className="mt-1 text-sm text-muted">Internal company record. Status is administrative, not a legal verification mark.</p>
      <div className="mt-6"><CompanyForm company={company as never} action={updateCompanyAction.bind(null, company.id)} /></div>
    </div>
  );
}
