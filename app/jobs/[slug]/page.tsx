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

function splitLines(body: string) {
  return body.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function Section({ title, body }: { title: string; body?: string | null }) {
  if (!body) return null;
  const lines = splitLines(body);
  const listLike = lines.length > 1;
  return (
    <section className="job-section">
      <h2 className="serif job-section-title">{title}</h2>
      {listLike ? (
        <ul className="job-list">
          {lines.map((line) => (
            <li key={line}>{line.replace(/^[-•]\s*/, "")}</li>
          ))}
        </ul>
      ) : (
        <p className="job-prose whitespace-pre-wrap">{body}</p>
      )}
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
      <main className="pb-[calc(5.25rem+env(safe-area-inset-bottom))] lg:pb-10">
        <div className="border-b border-line bg-surface">
          <div className="container-page py-6 sm:py-8 lg:py-10">
            <Link href="/jobs" className="text-sm text-muted hover:text-ink">← Open jobs</Link>
            <p className="mt-4 text-sm text-muted">{job.company.name}</p>
            <h1 className="serif page-title mt-1 max-w-3xl">{job.title}</h1>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-6 text-muted">{job.summary}</p>
            {!open && closedReason ? (
              <p className="mt-4 border border-line bg-warning-soft px-4 py-3 text-sm text-warning">{closedReason}</p>
            ) : null}
          </div>
        </div>
        <div className="container-page grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_16.5rem] lg:gap-12 lg:py-9">
          <article className="min-w-0">
            <section>
              <h2 className="serif job-section-title">Overview</h2>
              <dl className="meta-grid mt-4">
                {facts.map(([label, value]) => (
                  <div key={label} className={`meta-item ${label === "Experience" || label === "Deadline" ? "sm:col-span-2 lg:col-span-2" : ""}`}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
            <Section title="Responsibilities" body={job.responsibilities} />
            <Section title="Role description" body={job.description} />
            {job.skills.length > 0 ? (
              <section className="job-section">
                <h2 className="serif job-section-title">Skills</h2>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => (
                    <li key={skill} className="chip">{skill}</li>
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
            <div className="sticky top-20 border border-line bg-surface p-5">
              <p className="text-sm text-muted">{job.company.name}</p>
              <p className="mt-1 font-medium leading-snug">{job.title}</p>
              <p className="mt-3 text-sm text-muted">{formatSalary(job.salaryMin, job.salaryMax, job.salaryDisplay, job.salaryNegotiable)}</p>
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
