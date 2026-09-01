import Link from "next/link";
import type { Company, Job } from "@prisma/client";
import { EMPLOYMENT_LABELS, WORKPLACE_LABELS } from "@/lib/constants";
import { formatDate, formatSalary } from "@/lib/utils";

export function JobCard({ job }: { job: Job & { company: Company } }) {
  return (
    <article className="border border-line bg-surface p-5 sm:p-6">
      <p className="text-sm text-muted">{job.company.name}</p>
      <h3 className="serif mt-1 text-2xl text-ink">
        <Link href={`/jobs/${job.slug}`} className="hover:text-brand">{job.title}</Link>
      </h3>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <div>{job.location}</div>
        <div>{WORKPLACE_LABELS[job.workplaceType]}</div>
        <div>{EMPLOYMENT_LABELS[job.employmentType]}</div>
        {job.experienceRequirement ? <div>{job.experienceRequirement}</div> : null}
      </dl>
      <p className="mt-3 text-sm text-ink/80">{job.summary}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay, job.salaryNegotiable)}
          {job.applicationDeadline ? ` · Apply by ${formatDate(job.applicationDeadline)}` : ""}
        </p>
        <Link href={`/jobs/${job.slug}`} className="inline-flex h-10 items-center rounded-md bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover">
          View details
        </Link>
      </div>
    </article>
  );
}
