import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateCompanyAction } from "@/lib/actions/companies";
import { CompanyForm } from "@/components/admin/company-form";
export const metadata = { title: "Company" };
export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const company = await prisma.company.findUnique({ where: { id: (await params).id } });
  if (!company) notFound();
  return (
    <div>
      <h1 className="serif text-3xl">{company.name}</h1>
      <p className="mt-1 text-sm text-muted">Internal company record. Status is administrative, not a legal verification mark.</p>
      <div className="mt-6"><CompanyForm company={company} action={updateCompanyAction.bind(null, company.id)} /></div>
    </div>
  );
}
