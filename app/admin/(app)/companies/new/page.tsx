import { createCompanyAction } from "@/lib/actions/companies";
import { CompanyForm } from "@/components/admin/company-form";
export const metadata = { title: "New company" };
export default function NewCompanyPage() {
  return (
    <div>
      <h1 className="serif text-3xl">New company</h1>
      <div className="mt-6"><CompanyForm action={createCompanyAction} /></div>
    </div>
  );
}
