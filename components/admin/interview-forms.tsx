import type { Interview } from "@prisma/client";
import { scheduleInterviewAction, updateInterviewAction } from "@/lib/actions/recruitment";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { INTERVIEW_MODE_LABELS, INTERVIEW_MODES } from "@/lib/constants";

export function ScheduleInterviewForm({ applicationId }: { applicationId: string }) {
  return (
    <form action={scheduleInterviewAction.bind(null, applicationId)} className="grid gap-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Date"><Input name="date" type="date" required /></Field>
        <Field label="Time"><Input name="time" type="time" required /></Field>
      </div>
      <Field label="Mode">
        <Select name="mode" defaultValue="GOOGLE_MEET">
          {INTERVIEW_MODES.map((mode) => <option key={mode} value={mode}>{INTERVIEW_MODE_LABELS[mode]}</option>)}
        </Select>
      </Field>
      <Field label="Location"><Input name="location" /></Field>
      <Field label="Meeting URL"><Input name="meetingUrl" /></Field>
      <Field label="Interviewer"><Input name="interviewer" /></Field>
      <Field label="Candidate instruction"><Textarea name="candidateInstruction" /></Field>
      <Field label="Internal note"><Textarea name="internalNote" /></Field>
      <Button type="submit" size="sm">Schedule interview</Button>
    </form>
  );
}

export function InterviewManageForm({ interview }: { interview: Interview }) {
  const date = new Date(interview.scheduledAt).toISOString().slice(0, 10);
  const time = new Date(interview.scheduledAt).toTimeString().slice(0, 5);
  async function reschedule(formData: FormData) { "use server"; await updateInterviewAction(interview.id, "reschedule", formData); }
  async function cancel(formData: FormData) { "use server"; await updateInterviewAction(interview.id, "cancel", formData); }
  async function attended() { "use server"; await updateInterviewAction(interview.id, "attended"); }
  async function noShow() { "use server"; await updateInterviewAction(interview.id, "no_show"); }
  return (
    <div className="space-y-4">
      <form action={reschedule} className="grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Date"><Input name="date" type="date" defaultValue={date} /></Field>
          <Field label="Time"><Input name="time" type="time" defaultValue={time} /></Field>
        </div>
        <Field label="Location"><Input name="location" defaultValue={interview.location ?? ""} /></Field>
        <Field label="Meeting URL"><Input name="meetingUrl" defaultValue={interview.meetingUrl ?? ""} /></Field>
        <Field label="Candidate instruction"><Textarea name="candidateInstruction" defaultValue={interview.candidateInstruction ?? ""} /></Field>
        <Button type="submit" size="sm" variant="secondary">Reschedule</Button>
      </form>
      <div className="flex flex-wrap gap-2">
        <form action={attended}><Button type="submit" size="sm">Mark attended</Button></form>
        <form action={noShow}><Button type="submit" size="sm" variant="secondary">Mark no-show</Button></form>
      </div>
      <form action={cancel} className="grid gap-2">
        <Field label="Cancellation reason"><Input name="cancellationReason" /></Field>
        <Button type="submit" size="sm" variant="danger">Cancel interview</Button>
      </form>
    </div>
  );
}
