import Link from "next/link";
import { notFound } from "next/navigation";
import { ApplicationWizard } from "@/components/apply/application-wizard";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { getPublishedJobBySlug } from "@/lib/jobs";
import { isJobOpen } from "@/lib/utils";

export const metadata = { title: "Apply" };

export default async function ApplyPage({ params }: { params: Promise<{ slug: string }> }) {
  const job = await getPublishedJobBySlug((await params).slug);
  if (!job) notFound();
  const open = isJobOpen(job);
  return (
    <>
      <SiteHeader compact />
      <main className="container-narrow py-7 sm:py-10">
        <Link href={`/jobs/${job.slug}`} className="text-sm text-muted hover:text-ink">← {job.title}</Link>
        <p className="kicker mt-4">Application</p>
        <h1 className="serif page-title mt-2">Apply</h1>
        <p className="mt-1.5 text-sm text-muted">{job.title} · {job.company.name}</p>
        {!open ? (
          <p className="mt-6 border border-line bg-warning-soft px-4 py-3 text-sm text-warning">This role is no longer accepting applications.</p>
        ) : (
          <div className="mt-6">
            <ApplicationWizard job={{
              id: job.id, title: job.title, requireLinkedIn: job.requireLinkedIn, requirePortfolio: job.requirePortfolio,
              terms: job.terms, companyName: job.company.name, questions: job.questions,
            }} />
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
