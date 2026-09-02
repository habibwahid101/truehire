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
          <div className="container-page py-16 sm:py-24">
            <p className="text-xs uppercase tracking-[0.2em] text-brand">Managed recruitment</p>
            <h1 className="serif mt-4 max-w-3xl text-4xl text-ink sm:text-6xl">
              Clear opportunities.
              <br />
              Structured applications.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">
              TrueHire presents complete role information so candidates can apply with confidence,
              and recruiters can review every application with context.
            </p>
            <div className="mt-8">
              <Link href="/jobs" className="inline-flex h-12 items-center rounded-md bg-brand px-5 font-medium text-white hover:bg-brand-hover">
                View open jobs
              </Link>
            </div>
          </div>
        </section>
        <section className="container-page py-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="serif text-3xl">Open opportunities</h2>
              <p className="mt-2 text-muted">A curated set of live roles. Not a marketplace.</p>
            </div>
            <Link href="/jobs" className="text-sm text-brand hover:underline">All jobs</Link>
          </div>
          <div className="mt-8 grid gap-4">
            {jobs.length === 0 ? (
              <div className="border border-line bg-surface px-6 py-12 text-muted">
                There are no open roles at the moment. Please check back shortly.
              </div>
            ) : jobs.slice(0, 6).map((job) => <JobCard key={job.id} job={job} />)}
          </div>
        </section>
        <section className="border-y border-line bg-surface">
          <div className="container-page grid gap-10 py-16 sm:grid-cols-4">
            {[
              ["01", "Find a suitable opportunity", "Browse live roles with the information needed to decide."],
              ["02", "Understand the complete role", "Read responsibilities, requirements, terms and workplace details first."],
              ["03", "Submit your application", "A short, structured form. Review everything before you send it."],
              ["04", "Continue through recruitment", "Applications are reviewed, shortlisted and interviewed with a recorded history."],
            ].map(([n, t, d]) => (
              <div key={n}>
                <p className="text-xs uppercase tracking-[0.18em] text-faint">{n}</p>
                <h3 className="serif mt-3 text-xl">{t}</h3>
                <p className="mt-2 text-sm text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="container-page grid gap-10 py-16 sm:grid-cols-2">
          <div>
            <h2 className="serif text-3xl">Transparency before you apply</h2>
            <p className="mt-4 text-muted">
              Job information, expectations, conditions and application requirements are presented
              before you begin. If a detail is not available, it is marked as such rather than decorated.
            </p>
          </div>
          <div>
            <h2 className="serif text-3xl">How submitted information is used</h2>
            <p className="mt-4 text-muted">
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
