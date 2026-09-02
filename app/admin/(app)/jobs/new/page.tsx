import { createJobAction } from "@/lib/actions/jobs";
import { JobForm } from "@/components/admin/job-form";
import { adminCompanies } from "@/lib/admin-data";
export const metadata = { title: "New job" };
export default async function NewJobPage() {
  const companies = await adminCompanies();
  return (
    <div>
      <p className="kicker">Jobs</p>
      <h1 className="serif mt-2 text-3xl">New job</h1>
      <div className="mt-6"><JobForm companies={companies} action={createJobAction} /></div>
    </div>
  );
}
