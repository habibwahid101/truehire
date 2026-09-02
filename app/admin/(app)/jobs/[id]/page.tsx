import { notFound } from "next/navigation";
import { updateJobAction } from "@/lib/actions/jobs";
import { JobForm } from "@/components/admin/job-form";
import { JobStatusActions } from "@/components/admin/job-status-actions";
import { StatusBadge } from "@/components/ui/badge";
import { adminCompanies, adminJob } from "@/lib/admin-data";
export const metadata = { title: "Edit job" };
export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [job, companies] = await Promise.all([adminJob(id), adminCompanies()]);
  if (!job) notFound();
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="kicker">Job</p>
          <h1 className="serif mt-2 text-3xl">{job.title}</h1>
          <div className="mt-2"><StatusBadge value={job.status} /></div>
        </div>
        <JobStatusActions id={job.id} status={job.status} slug={job.slug} />
      </div>
      <div className="mt-6"><JobForm job={job as never} companies={companies as never} action={updateJobAction.bind(null, job.id)} /></div>
    </div>
  );
}
