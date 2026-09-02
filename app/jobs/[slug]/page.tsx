import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { ApplyCta } from "@/components/jobs/apply-cta";
import { EMPLOYMENT_LABELS, WORKPLACE_LABELS } from "@/lib/constants";
import { getPublishedJobBySlug } from "@/lib/jobs";
import { formatDate, formatSalary, isJobOpen } from "@/lib/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const job = await getPublishedJobBySlug((await params).slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} at ${job.company.name}`,
    description: job.summary,
    alternates: { canonical: `/jobs/${job.slug}` },
    openGraph: { title: `${job.title} · ${job.company.name}`, description: job.summary },
  };
}

function Section({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  return (
    <section className="border-t border-line py-8">
      <h2 className="serif text-2xl">{title}</h2>
      <div className="prose-job mt-4 whitespace-pre-wrap text-[16.5px] text-ink/90">{body}</div>
    </section>
  );
}

export default async function JobDetailPage({ params }: Props) {
  const job = await getPublishedJobBySlug((await params).slug);
  if (!job || job.status === "DRAFT") notFound();
  const open = isJobOpen(job);
  const closedReason = job.status === "CLOSED"
    ? "This role is closed and is no longer accepting applications."
    : job.applicationDeadline && new Date(job.applicationDeadline).getTime() < Date.now()
      ? "The application deadline for this role has passed."
      : null;
  const facts = [
    ["Location", job.location],
    ["Workplace", WORKPLACE_LABELS[job.workplaceType]],
    ["Employment", EMPLOYMENT_LABELS[job.employmentType]],
    ["Vacancies", String(job.vacancyCount)],
    ["Salary", formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay, job.salaryNegotiable)],
    ["Education", job.educationRequirement],
    ["Experience", job.experienceRequirement],
    ["Working days", job.workingDays],
    ["Working hours", job.workingHours],
    ["Probation", job.probation],
    ["Joining", job.joiningExpectation],
    ["Deadline", job.applicationDeadline ? formatDate(job.applicationDeadline) : "Open"],
  ].filter(([, value]) => value);

  return (
    <>
      <SiteHeader />
      <main className="pb-28 sm:pb-16">
        <div className="border-b border-line bg-surface">
          <div className="container-page py-10 sm:py-14">
            <Link href="/jobs" className="text-sm text-muted hover:text-ink">← Open jobs</Link>
            <p className="mt-6 text-sm text-muted">{job.company.name}</p>
            <h1 className="serif mt-2 max-w-3xl text-4xl sm:text-5xl">{job.title}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{job.summary}</p>
            {!open && closedReason ? (
              <p className="mt-6 border border-line bg-warning-soft px-4 py-3 text-sm text-warning">{closedReason}</p>
            ) : null}
          </div>
        </div>
        <div className="container-page grid gap-12 py-10 lg:grid-cols-[1fr_280px]">
          <article>
            <section>
              <h2 className="serif text-2xl">Overview</h2>
              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                {facts.map(([label, value]) => (
                  <div key={label} className="border-b border-line pb-3">
                    <dt className="text-xs uppercase tracking-[0.14em] text-faint">{label}</dt>
                    <dd className="mt-1 text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <Section title="Responsibilities" body={job.responsibilities} />
            <Section title="Role description" body={job.description} />
            {job.skills.length > 0 ? (
              <section className="border-t border-line py-8">
                <h2 className="serif text-2xl">Skills</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <li key={skill} className="border border-line bg-surface px-3 py-1 text-sm">{skill}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            <Section title="Preferred qualifications" body={job.preferredQualifications} />
            <Section title="Compensation & benefits" body={job.benefits} />
            <Section title="Company" body={job.company.overview} />
            <Section title="Application instructions" body={job.instructions} />
            <Section title="Terms and conditions" body={job.terms} />
          </article>
          <aside className="hidden lg:block">
            <div className="sticky top-8 border border-line bg-surface p-5">
              <p className="text-sm text-muted">{job.company.name}</p>
              <p className="mt-1 font-medium">{job.title}</p>
              {open ? (
                <Link href={`/jobs/${job.slug}/apply`} className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-md bg-brand text-sm font-medium text-white hover:bg-brand-hover">
                  Apply for this role
                </Link>
              ) : <p className="mt-4 text-sm text-muted">Applications are closed.</p>}
            </div>
          </aside>
        </div>
      </main>
      {open ? <ApplyCta href={`/jobs/${job.slug}/apply`} /> : null}
      <SiteFooter />
    </>
  );
}
