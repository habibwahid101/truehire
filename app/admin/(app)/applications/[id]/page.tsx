import Link from "next/link";
import { notFound } from "next/navigation";
import { markApplicationOpenedAction } from "@/lib/actions/recruitment";
import { StatusBadge } from "@/components/ui/badge";
import { ApplicationStatusForm } from "@/components/admin/application-actions";
import { EvaluationForm } from "@/components/admin/evaluation-form";
import { InterviewManageForm, ScheduleInterviewForm } from "@/components/admin/interview-forms";
import { adminApplication } from "@/lib/admin-data";
import { isReviewUi } from "@/lib/review";
import { formatDate, formatDateTime } from "@/lib/utils";
export const metadata = { title: "Candidate" };
export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const application = await adminApplication((await params).id);
  if (!application) notFound();
  if (!isReviewUi()) await markApplicationOpenedAction(application.id);
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{application.publicReference}</p>
          <h1 className="serif mt-1 text-3xl">{application.candidateName}</h1>
          <p className="mt-1 text-muted">{application.job.title} · {application.job.company.name}</p>
        </div>
        <StatusBadge value={application.status} />
      </div>
      <section className="panel grid gap-4 p-5 sm:grid-cols-3">
        <div><p className="text-[11px] uppercase tracking-[0.14em] text-faint">Current role</p><p>{application.currentDesignation || "—"} at {application.currentCompany || "—"}</p></div>
        <div><p className="text-[11px] uppercase tracking-[0.14em] text-faint">Experience</p><p>{String(application.totalExperienceYrs)} years · {application.highestEducation}</p></div>
        <div><p className="text-[11px] uppercase tracking-[0.14em] text-faint">Availability</p><p>{application.noticePeriod || "—"}</p></div>
        <div><p className="text-[11px] uppercase tracking-[0.14em] text-faint">Current salary</p><p>{application.currentSalary ? `BDT ${application.currentSalary}` : "—"}</p></div>
        <div><p className="text-[11px] uppercase tracking-[0.14em] text-faint">Expected salary</p><p>{application.expectedSalary ? `BDT ${application.expectedSalary}` : "—"}</p></div>
        <div><p className="text-[11px] uppercase tracking-[0.14em] text-faint">Skills</p><p>{application.skills}</p></div>
        <div className="sm:col-span-3 text-sm"><span className="text-brand">CV: {application.cvFileName}</span></div>
      </section>
      <ApplicationStatusForm applicationId={application.id} status={application.status} />
      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="serif text-2xl">Application</h2>
          <dl className="mt-4 grid gap-2 text-sm">
            <div><span className="text-muted">Email.</span> {application.email}</div>
            <div><span className="text-muted">Mobile.</span> {application.phone}</div>
            <div><span className="text-muted">Location.</span> {application.currentLocation}</div>
            <div><span className="text-muted">Education.</span> {application.highestEducation} {application.institution}</div>
            <div><span className="text-muted">Suitability.</span> {application.suitability}</div>
            <div><span className="text-muted">Submitted.</span> {formatDate(application.submittedAt)}</div>
          </dl>
        </div>
        <div>
          <h2 className="serif text-2xl">Internal evaluation</h2>
          <div className="panel mt-4 p-4"><EvaluationForm applicationId={application.id} evaluation={application.evaluation} /></div>
        </div>
      </section>
      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="serif text-2xl">Interviews</h2>
          <div className="mt-4 space-y-6">
            {application.interviews.map((interview) => (
              <div key={interview.id} className="panel p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-sm">{formatDateTime(interview.scheduledAt)}</p>
                  <StatusBadge value={interview.status} />
                </div>
                {interview.status === "CANCELLED" || interview.status === "ATTENDED" || interview.status === "NO_SHOW" ? (
                  <p className="text-sm text-muted">{interview.cancellationReason || interview.mode}</p>
                ) : <InterviewManageForm interview={interview as never} />}
              </div>
            ))}
            <div className="panel p-4">
              <h3 className="mb-3 font-medium">Schedule interview</h3>
              <ScheduleInterviewForm applicationId={application.id} />
            </div>
          </div>
        </div>
        <div>
          <h2 className="serif text-2xl">Activity</h2>
          <ol className="mt-4 space-y-3">
            {application.activities.map((event) => (
              <li key={event.id} className="border-l border-line pl-4 text-sm">
                <p>{event.summary}</p>
                <p className="text-muted">{formatDateTime(event.createdAt)}{event.actor ? ` · ${event.actor.name}` : ""}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <Link href="/admin/applications" className="text-sm text-brand">← Applications</Link>
    </div>
  );
}
