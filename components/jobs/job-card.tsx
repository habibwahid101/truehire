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
    <article className="panel p-4 sm:p-5 lg:grid lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:items-start lg:gap-8">
      <div className="min-w-0">
        <p className="text-sm text-muted">{job.company.name}</p>
        <h3 className="serif mt-1 text-[1.35rem] leading-tight text-ink sm:text-[1.55rem]">
          <Link href={`/jobs/${job.slug}`} className="hover:text-brand">{job.title}</Link>
        </h3>
        <dl className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[13px] text-muted">
          <div>{job.location}</div>
          <div>{WORKPLACE_LABELS[job.workplaceType]}</div>
          <div>{EMPLOYMENT_LABELS[job.employmentType]}</div>
          {job.experienceRequirement ? <div>{job.experienceRequirement}</div> : null}
        </dl>
        <p className="mt-2.5 max-w-3xl text-[15px] leading-6 text-ink/80">{job.summary}</p>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-0 lg:flex-col lg:items-stretch lg:justify-start">
        <p className="text-sm text-muted lg:text-right">
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
