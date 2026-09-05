import Link from "next/link";
import type { AdminPublicJob } from "@/lib/review-types";

function FullTimeIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <rect x="6" y="16" width="16" height="12" rx="1.5" stroke="#0A0A0A" strokeWidth="1.4" />
      <path d="M10 16V13.5C10 11.6 11.6 10 13.5 10H14.5C16.4 10 18 11.6 18 13.5V16" stroke="#0A0A0A" strokeWidth="1.4" />
      <rect x="25" y="18" width="9" height="10" rx="1.2" stroke="#3A83F6" strokeWidth="1.4" />
      <circle cx="29.5" cy="22" r="1.3" fill="#3A83F6" />
    </svg>
  );
}

function PartTimeIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <circle cx="20" cy="20" r="11" stroke="#0A0A0A" strokeWidth="1.4" />
      <path d="M20 13V20L25 23" stroke="#3A83F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RemoteIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <rect x="8" y="11" width="24" height="15" rx="1.8" stroke="#0A0A0A" strokeWidth="1.4" />
      <path d="M14 30H26" stroke="#0A0A0A" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M20 26V30" stroke="#0A0A0A" strokeWidth="1.4" />
      <rect x="12" y="14" width="16" height="8" fill="#EAF2FE" />
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" fill="none" aria-hidden="true">
      <rect x="11" y="8" width="18" height="24" rx="1.6" stroke="#0A0A0A" strokeWidth="1.4" />
      <path d="M16 16H24" stroke="#3A83F6" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 21H24" stroke="#E4E4E4" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 26H21" stroke="#E4E4E4" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const FILTERS = [
  {
    href: "/jobs?type=FULL_TIME",
    label: "Full-time",
    detail: "Regular working schedule",
    Icon: FullTimeIcon,
    match: (job: AdminPublicJob) => job.employmentType === "FULL_TIME",
  },
  {
    href: "/jobs?type=PART_TIME",
    label: "Part-time",
    detail: "Reduced working hours",
    Icon: PartTimeIcon,
    match: (job: AdminPublicJob) => job.employmentType === "PART_TIME",
  },
  {
    href: "/jobs?workplace=REMOTE",
    label: "Remote",
    detail: "Work from anywhere",
    Icon: RemoteIcon,
    match: (job: AdminPublicJob) => job.workplaceType === "REMOTE",
  },
  {
    href: "/jobs?type=CONTRACT",
    label: "Contractual",
    detail: "Fixed-term or project-based",
    Icon: ContractIcon,
    match: (job: AdminPublicJob) => job.employmentType === "CONTRACT",
  },
] as const;

export function QuickJobFilters({ jobs }: { jobs: AdminPublicJob[] }) {
  return (
    <section className="container-page pt-6 sm:pt-8" aria-labelledby="quick-job-filters">
      <h2 id="quick-job-filters" className="text-[13.5px] font-medium text-ink">Quick job filters</h2>
      <p className="mt-1 text-sm text-muted">Choose the work style that fits you.</p>
      <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-3">
        {FILTERS.map((filter) => {
          const count = jobs.filter(filter.match).length;
          const quiet = count === 0;
          return (
            <Link
              key={filter.href}
              href={filter.href}
              className={`flex min-h-[7.25rem] flex-col border bg-surface p-3.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand hover:border-brand ${quiet ? "border-line text-muted" : "border-line text-ink"}`}
            >
              <filter.Icon />
              <p className={`mt-2.5 text-sm font-medium ${quiet ? "text-muted" : "text-ink"}`}>{filter.label}</p>
              <p className="mt-0.5 text-[12.5px] leading-5 text-muted">{filter.detail}</p>
              {count > 0 ? (
                <span className="mt-2 inline-flex w-fit rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
                  {count} {count === 1 ? "job" : "jobs"}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
