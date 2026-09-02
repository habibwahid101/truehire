import Link from "next/link";
import { prisma } from "@/lib/db";
import { SiteFooter, SiteHeader } from "@/components/site-header";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Application submitted" };

export default async function SuccessPage({ params }: { params: Promise<{ reference: string }> }) {
  const { reference } = await params;
  const application = await prisma.application.findUnique({
    where: { publicReference: reference },
    include: { job: { include: { company: true } } },
  });
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-16">
        <p className="text-xs uppercase tracking-[0.18em] text-brand">Application received</p>
        <h1 className="serif mt-3 text-4xl">Application successfully submitted</h1>
        {application ? (
          <div className="mt-8 border border-line bg-surface p-6">
            <p className="text-muted">{application.candidateName}</p>
            <p className="mt-1 text-lg">{application.job.title} · {application.job.company.name}</p>
            <p className="mt-6 serif text-3xl">{application.publicReference}</p>
            <p className="mt-2 text-sm text-muted">Submitted {formatDate(application.submittedAt)}</p>
          </div>
        ) : <p className="mt-6 text-muted">Reference {reference}</p>}
        <p className="mt-8 max-w-xl text-muted">
          The recruitment team will review your application as part of this process. This confirmation
          does not guarantee an interview or a further response. Keep your reference for any follow-up.
        </p>
        <Link href="/jobs" className="mt-8 inline-flex text-sm text-brand hover:underline">Browse other open jobs</Link>
      </main>
      <SiteFooter />
    </>
  );
}
