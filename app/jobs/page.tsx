import { SiteFooter, SiteHeader } from "@/components/site-header";
import { JobCard } from "@/components/jobs/job-card";
import { Input, Select } from "@/components/ui/field";
import { EMPLOYMENT_LABELS, EMPLOYMENT_TYPES } from "@/lib/constants";
import { listPublishedJobs } from "@/lib/jobs";

export const metadata = { title: "Open jobs" };

export default async function JobsPage({
  searchParams,
}: { searchParams: Promise<{ q?: string; location?: string; type?: string }> }) {
  const params = await searchParams;
  const jobs = await listPublishedJobs({ q: params.q, location: params.location, employmentType: params.type });
  return (
    <>
      <SiteHeader />
      <main className="container-page py-10 sm:py-14">
        <h1 className="serif text-4xl">Open jobs</h1>
        <p className="mt-2 max-w-2xl text-muted">Review the complete role before you apply. Closed and expired vacancies are not listed.</p>
        <form className="mt-8 grid gap-3 sm:grid-cols-4" method="get">
          <Input name="q" placeholder="Search title or company" defaultValue={params.q} aria-label="Keyword" />
          <Input name="location" placeholder="Location" defaultValue={params.location} aria-label="Location" />
          <Select name="type" defaultValue={params.type || ""} aria-label="Employment type">
            <option value="">All employment types</option>
            {EMPLOYMENT_TYPES.map((type) => <option key={type} value={type}>{EMPLOYMENT_LABELS[type]}</option>)}
          </Select>
          <button className="h-[46px] rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-hover">Filter</button>
        </form>
        <div className="mt-8 grid gap-4">
          {jobs.length === 0 ? (
            <div className="border border-line bg-surface px-6 py-12 text-muted">No open jobs match those filters. Clear the search or check back later.</div>
          ) : jobs.map((job) => <JobCard key={job.id} job={job} />)}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
