import { prisma } from "@/lib/db";
import { createJobAction } from "@/lib/actions/jobs";
import { JobForm } from "@/components/admin/job-form";
export const metadata = { title: "New job" };
export default async function NewJobPage() {
  const companies = await prisma.company.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 className="serif text-3xl">New job</h1>
      <div className="mt-6"><JobForm companies={companies} action={createJobAction} /></div>
    </div>
  );
}
