import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateJobAction } from "@/lib/actions/jobs";
import { JobForm } from "@/components/admin/job-form";
import { JobStatusActions } from "@/components/admin/job-status-actions";
import { StatusBadge } from "@/components/ui/badge";
export const metadata = { title: "Edit job" };
export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, companies] = await Promise.all([
    prisma.job.findUnique({ where: { id }, include: { questions: { orderBy: { sortOrder: "asc" } } } }),
    prisma.company.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!job) notFound();
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="serif text-3xl">{job.title}</h1>
          <div className="mt-2"><StatusBadge value={job.status} /></div>
        </div>
        <JobStatusActions id={job.id} status={job.status} slug={job.slug} />
      </div>
      <div className="mt-6"><JobForm job={job} companies={companies} action={updateJobAction.bind(null, job.id)} /></div>
    </div>
  );
}
