import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { JobCard } from "@/components/jobs/job-card";
import { listPublishedJobs } from "@/lib/jobs";

export default async function HomePage() {
  const jobs = await listPublishedJobs();
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-line bg-surface">
          <div className="container-page page-intro sm:py-16 lg:py-20">
            <p className="kicker">Managed recruitment</p>
            <h1 className="serif display-title mt-3 max-w-3xl">
              Clear opportunities.
              <br />
              Structured applications.
            </h1>
            <p className="mt-4 max-w-xl text-[15.5px] leading-6 text-muted sm:text-base">
              TrueHire presents complete role information so candidates can apply with confidence,
              and recruiters can review every application with context.
            </p>
            <div className="mt-6">
              <Link href="/jobs" className="inline-flex h-11 items-center rounded-md bg-brand px-5 text-sm font-medium text-white hover:bg-brand-hover">
                View open jobs
              </Link>
            </div>
          </div>
        </section>
        <section className="container-page section-gap">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="serif section-title">Open opportunities</h2>
              <p className="mt-1.5 text-sm text-muted">A curated set of live roles. Not a marketplace.</p>
            </div>
            <Link href="/jobs" className="text-sm text-brand hover:underline">All jobs</Link>
          </div>
          <div className="mt-5 grid gap-3 sm:gap-4">
            {jobs.length === 0 ? (
              <div className="border border-line bg-surface px-5 py-8 text-sm text-muted">
                There are no open roles at the moment. Please check back shortly.
              </div>
            ) : jobs.slice(0, 6).map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
        <section className="border-y border-line bg-surface">
          <div className="container-page grid gap-6 py-8 sm:grid-cols-2 sm:gap-8 sm:py-10 lg:grid-cols-4">
            {[
              ["01", "Find a suitable opportunity", "Browse live roles with the information needed to decide."],
              ["02", "Understand the complete role", "Read responsibilities, requirements, terms and workplace details first."],
              ["03", "Submit your application", "A short, structured form. Review everything before you send it."],
              ["04", "Continue through recruitment", "Applications are reviewed, shortlisted and interviewed with a recorded history."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <p className="text-[11px] uppercase tracking-[0.16em] text-faint">{n}</p>
                <h3 className="serif mt-2 text-lg leading-snug">{t}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="container-page grid gap-8 py-8 sm:grid-cols-2 sm:gap-10 sm:py-12">
          <div>
            <h2 className="serif section-title">Transparency before you apply</h2>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-[15.5px]">
              Job information, expectations, conditions and application requirements are presented
              before you begin. If a detail is not available, it is marked as such rather than decorated.
            </p>
          </div>
          <div>
            <h2 className="serif section-title">How submitted information is used</h2>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-[15.5px]">
              Application data is used for recruitment related to the role you applied for. CVs and
              personal details are stored privately and are not published.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
