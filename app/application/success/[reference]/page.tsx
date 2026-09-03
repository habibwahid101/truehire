import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { getApplicationByReference } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Application submitted" };

export default async function SuccessPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const application = await getApplicationByReference(reference);
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-8 sm:py-12">
        <p className="kicker">Application received</p>
        <h1 className="serif page-title mt-2">Application successfully submitted</h1>
        <div className="panel mt-6 p-5 sm:p-6">
          {application ? (
            <>
              <p className="text-sm text-muted">{application.candidateName}</p>
              <p className="mt-1">{application.job.title} · {application.job.company.name}</p>
              <p className="serif mt-5 text-[1.65rem] tracking-tight sm:text-3xl">{application.publicReference}</p>
              <p className="mt-2 text-sm text-muted">Submitted {formatDate(application.submittedAt)}</p>
            </>
          ) : (
            <>
              <p className="serif text-[1.65rem] tracking-tight sm:text-3xl">{decodeURIComponent(reference)}</p>
              <p className="mt-2 text-sm text-muted">Keep this reference for any follow-up.</p>
            </>
          )}
        </div>
        <p className="mt-6 max-w-xl text-sm leading-6 text-muted">
          The recruitment team will review your application as part of this process. This confirmation
          does not guarantee an interview or a further response.
        </p>
        <Link href="/jobs" className="mt-6 inline-flex text-sm text-brand hover:underline">Browse other open jobs</Link>
      </main>
      <SiteFooter />
    </>
  );
}
