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

function cardSummary(value: string) {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text) return "";
  const sentence = /[.!?]$/.test(text) ? text : `${text}.`;
  if (sentence.length <= 148) return sentence;
  const cut = sentence.slice(0, 145);
  const at = cut.lastIndexOf(" ");
  return `${cut.slice(0, at > 90 ? at : 145).replace(/[,;:]$/, "")}.`;
}

export function JobCard({ job }: { job: JobCardJob }) {
  return (
    <article className="panel p-4 sm:p-5 lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-start lg:gap-8">
      <div className="min-w-0">
        <p className="text-sm text-muted">{job.company.name}</p>
        <h3 className="serif mt-1.5 text-[1.35rem] leading-tight text-ink sm:text-[1.55rem]">
          <Link href={`/jobs/${job.slug}`} className="hover:text-brand">{job.title}</Link>
        </h3>
        <p className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[13px] leading-5 text-muted">
          <span>{job.location}</span>
          <span>{WORKPLACE_LABELS[job.workplaceType]}</span>
          <span>{EMPLOYMENT_LABELS[job.employmentType]}</span>
        </p>
        {job.experienceRequirement ? (
          <p className="mt-2 text-[13px] leading-5 text-muted">{job.experienceRequirement}</p>
        ) : null}
        <p className="mt-3 max-w-3xl text-[15px] leading-6 text-ink/80">{cardSummary(job.summary)}</p>
      </div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between lg:mt-0 lg:flex-col lg:items-stretch">
        <dl className="min-w-0 space-y-1.5 text-sm">
          <div>
            <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">Salary</dt>
            <dd className="mt-0.5 text-ink/80">{formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay, job.salaryNegotiable)}</dd>
          </div>
          {job.applicationDeadline ? (
            <div>
              <dt className="text-[11px] uppercase tracking-[0.12em] text-faint">Deadline</dt>
              <dd className="mt-0.5 text-ink/80">{formatDate(job.applicationDeadline)}</dd>
            </div>
          ) : null}
        </dl>
        <Link href={`/jobs/${job.slug}`} className="inline-flex h-10 shrink-0 items-center justify-center rounded-md bg-brand px-4 text-sm font-medium text-white hover:bg-brand-hover">
          View details
        </Link>
      </div>
    </article>
  );
}
