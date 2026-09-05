import Link from "next/link";
import type { AdminPublicJob } from "@/lib/review-types";

const FILTERS = [
  { href: "/jobs?type=FULL_TIME", label: "Full-time", match: (job: AdminPublicJob) => job.employmentType === "FULL_TIME" },
  { href: "/jobs?type=PART_TIME", label: "Part-time", match: (job: AdminPublicJob) => job.employmentType === "PART_TIME" },
  { href: "/jobs?workplace=REMOTE", label: "Remote", match: (job: AdminPublicJob) => job.workplaceType === "REMOTE" },
  { href: "/jobs?type=CONTRACT", label: "Contractual", match: (job: AdminPublicJob) => job.employmentType === "CONTRACT" },
] as const;

export function QuickJobFilters({ jobs }: { jobs: AdminPublicJob[] }) {
  return (
    <section className="container-page pt-6 sm:pt-8" aria-labelledby="quick-job-filters">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 id="quick-job-filters" className="text-[13.5px] font-medium text-ink">Quick job filters</h2>
          <p className="mt-1 text-sm text-muted">Jump to a working pattern that already has an open role.</p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {FILTERS.map((filter) => {
          const count = jobs.filter(filter.match).length;
          return (
            <Link
              key={filter.href}
              href={filter.href}
              className="inline-flex min-h-10 items-center gap-2 border border-line bg-surface px-3.5 text-sm text-ink hover:border-brand hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              {filter.label}
              {count > 0 ? <span className="text-faint">{count}</span> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
