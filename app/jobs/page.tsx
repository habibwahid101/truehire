import { SiteFooter, SiteHeader } from "@/components/site-header";
import { JobCard } from "@/components/jobs/job-card";
import { Input, Select } from "@/components/ui/field";
import { EMPLOYMENT_LABELS, EMPLOYMENT_TYPES, WORKPLACE_TYPES } from "@/lib/constants";
import { listPublishedJobs } from "@/lib/jobs";

export const metadata = { title: "Open jobs" };

export default async function JobsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; location?: string; type?: string; workplace?: string }> }) {
  const params = await searchParams;
  const [allOpen, jobs] = await Promise.all([
    listPublishedJobs(),
    listPublishedJobs({
      q: params.q,
      location: params.location,
      employmentType: params.type,
      workplaceType: params.workplace,
    }),
  ]);
  const locations = [...new Set(allOpen.map((job) => job.location).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return (
    <>
      <SiteHeader />
      <main className="container-page page-intro pb-10 sm:pb-12">
        <h1 className="serif page-title">Open jobs</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted sm:text-[15.5px]">Review the complete role before you apply. Closed and expired vacancies are not listed.</p>
        <form className="mt-5 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]" method="get">
          <Input name="q" placeholder="Search title or company" defaultValue={params.q} aria-label="Keyword" />
          <Select name="location" defaultValue={params.location || ""} aria-label="Location">
            <option value="">All locations</option>
            {locations.map((location) => <option key={location} value={location}>{location}</option>)}
          </Select>
          <Select name="type" defaultValue={params.type || ""} aria-label="Employment type">
            <option value="">All employment types</option>
            {EMPLOYMENT_TYPES.map((type) => <option key={type} value={type}>{EMPLOYMENT_LABELS[type]}</option>)}
          </Select>
          {params.workplace && WORKPLACE_TYPES.includes(params.workplace as typeof WORKPLACE_TYPES[number]) ? (
            <input type="hidden" name="workplace" value={params.workplace} />
          ) : null}
          <button className="h-11 rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-hover lg:min-w-28">Filter</button>
        </form>
        <div className="mt-5 grid gap-3 sm:mt-6 sm:gap-4">
          {jobs.length === 0 ? (
            <div className="border border-line bg-surface px-5 py-8 text-sm text-muted">No open jobs match those filters. Clear the search or check back later.</div>
          ) : jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
