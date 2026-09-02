import Link from "next/link";
import { EMPLOYMENT_LABELS, WORKPLACE_LABELS } from "@/lib/constants";
import { formatDate, formatSalary } from "@/lib/utils";

type JobCardJob = {
  slug: string;
  title: string;
  summary: string;
  location: string;
  workplaceType: keyof typeof WORKPLACE_LABELS;
  employmentType: keyof typeof EMPLOYMENT_LABELS;
  experienceRequirement?: string | null;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryDisplay?: string | null;
  salaryNegotiable?: boolean;
  applicationDeadline?: Date | string | null;
  company: { name: string };
};

export function JobCard({ job }: { job: JobCardJob }) {
  return (
    <article className="panel p-5 sm:p-6">
      <p className="text-sm text-muted">{job.company.name}</p>
      <h3 className="serif mt-1 text-[26px] leading-tight text-ink sm:text-3xl">
        <Link href={`/jobs/${job.slug}`} className="hover:text-brand">{job.title}</Link>
      </h3>
      <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
        <div>{job.location}</div>
        <div>{WORKPLACE_LABELS[job.workplaceType]}</div>
        <div>{EMPLOYMENT_LABELS[job.employmentType]}</div>
        {job.experienceRequirement ? <div>{job.experienceRequirement}</div> : null}
      </dl>
      <p className="mt-3 max-w-3xl text-[15px] text-ink/80 sm:text-base">{job.summary}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay, job.salaryNegotiable)}
          {job.applicationDeadline ? ` · Apply by ${formatDate(job.applicationDeadline)}` : ""}
        </p>
        <Link href={`/jobs/${job.slug}`} className="inline-flex h-10 items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover">
          View details
        </Link>
      </div>
    </article>
  );
}
