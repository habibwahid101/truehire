"use server";

import { revalidatePath } from "next/cache";
import type { ApplicationStatus, InterviewStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordActivity } from "@/lib/activity";
import { sendInterviewEmail } from "@/lib/email";
import { requireAdminSession } from "@/lib/session";
import { evaluationSchema, interviewSchema } from "@/lib/validation";
import { APPLICATION_STATUS_LABELS, type ApplicationStatusValue } from "@/lib/constants";

function touch(paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

export async function updateApplicationStatusAction(applicationId: string, status: ApplicationStatus) {
  const session = await requireAdminSession();
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application) return { error: "Application not found." };
  if (application.status === status) return { ok: true };
  await prisma.$transaction(async (tx) => {
    await tx.application.update({ where: { id: applicationId }, data: { status } });
    await recordActivity(tx, {
      applicationId,
      actorId: session.sub,
      eventType: "STATUS_CHANGED",
      summary: `Status changed to ${APPLICATION_STATUS_LABELS[status as ApplicationStatusValue]}`,
      metadata: { from: application.status, to: status },
    });
  });
  touch(["/admin", "/admin/applications", `/admin/applications/${applicationId}`, "/admin/interviews"]);
  return { ok: true };
}

export async function saveEvaluationAction(applicationId: string, formData: FormData) {
  const session = await requireAdminSession();
  const parsed = evaluationSchema.safeParse({
    rating: formData.get("rating") || undefined,
    strengths: formData.get("strengths"),
    concerns: formData.get("concerns"),
    internalNote: formData.get("internalNote"),
    recommendedAction: formData.get("recommendedAction"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Could not save evaluation." };
  await prisma.candidateEvaluation.upsert({
    where: { applicationId },
    create: {
      applicationId,
      rating: parsed.data.rating ?? null,
      strengths: parsed.data.strengths || null,
      concerns: parsed.data.concerns || null,
      internalNote: parsed.data.internalNote || null,
      recommendedAction: parsed.data.recommendedAction || null,
      createdById: session.sub,
      updatedById: session.sub,
    },
    update: {
      rating: parsed.data.rating ?? null,
      strengths: parsed.data.strengths || null,
      concerns: parsed.data.concerns || null,
      internalNote: parsed.data.internalNote || null,
      recommendedAction: parsed.data.recommendedAction || null,
      updatedById: session.sub,
    },
  });
  await recordActivity(prisma, {
    applicationId,
    actorId: session.sub,
    eventType: "EVALUATION_UPDATED",
    summary: "Internal evaluation updated",
  });
  touch([`/admin/applications/${applicationId}`]);
  return { ok: true };
}

export async function scheduleInterviewAction(applicationId: string, formData: FormData) {
  const session = await requireAdminSession();
  const parsed = interviewSchema.safeParse({
    date: formData.get("date"),
    time: formData.get("time"),
    timezone: formData.get("timezone") || "Asia/Dhaka",
    mode: formData.get("mode"),
    location: formData.get("location"),
    meetingUrl: formData.get("meetingUrl"),
    interviewer: formData.get("interviewer"),
    candidateInstruction: formData.get("candidateInstruction"),
    internalNote: formData.get("internalNote"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Check the interview details." };
  const scheduledAt = new Date(`${parsed.data.date}T${parsed.data.time}:00+06:00`);
  if (Number.isNaN(scheduledAt.getTime())) return { error: "The interview date or time is not valid." };
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: { job: { include: { company: true } } },
  });
  if (!application) return { error: "Application not found." };
  const interview = await prisma.$transaction(async (tx) => {
    const created = await tx.interview.create({
      data: {
        applicationId,
        scheduledAt,
        timezone: parsed.data.timezone,
        mode: parsed.data.mode,
        location: parsed.data.location || null,
        meetingUrl: parsed.data.meetingUrl || null,
        interviewer: parsed.data.interviewer || null,
        candidateInstruction: parsed.data.candidateInstruction || null,
        internalNote: parsed.data.internalNote || null,
        status: "SCHEDULED",
        createdById: session.sub,
      },
    });
    await tx.application.update({ where: { id: applicationId }, data: { status: "INTERVIEW_SCHEDULED" } });
    await recordActivity(tx, {
      applicationId,
      actorId: session.sub,
      eventType: "INTERVIEW_SCHEDULED",
      summary: `Interview scheduled for ${scheduledAt.toISOString()}`,
      metadata: { interviewId: created.id, mode: created.mode },
    });
    return created;
  });
  void sendInterviewEmail({
    kind: "scheduled",
    to: application.email,
    candidateName: application.candidateName,
    jobTitle: application.job.title,
    companyName: application.job.company.name,
    scheduledAt,
    mode: interview.mode,
    location: interview.location,
    meetingUrl: interview.meetingUrl,
    instruction: interview.candidateInstruction,
    reference: application.publicReference,
  });
  touch(["/admin", "/admin/interviews", `/admin/applications/${applicationId}`]);
  return { ok: true };
}

export async function updateInterviewAction(
  interviewId: string,
  action: "reschedule" | "cancel" | "attended" | "no_show",
  formData?: FormData,
) {
  const session = await requireAdminSession();
  const interview = await prisma.interview.findUnique({
    where: { id: interviewId },
    include: { application: { include: { job: { include: { company: true } } } } },
  });
  if (!interview) return { error: "Interview not found." };

  let nextInterviewStatus: InterviewStatus = interview.status;
  let nextAppStatus: ApplicationStatus | null = null;
  let scheduledAt = interview.scheduledAt;
  let cancellationReason = interview.cancellationReason;
  let eventType: "INTERVIEW_RESCHEDULED" | "INTERVIEW_CANCELLED" | "INTERVIEW_ATTENDED" | "INTERVIEW_NO_SHOW" = "INTERVIEW_RESCHEDULED";
  let summary = "";

  if (action === "reschedule") {
    scheduledAt = new Date(`${String(formData?.get("date") || "")}T${String(formData?.get("time") || "")}:00+06:00`);
    if (Number.isNaN(scheduledAt.getTime())) return { error: "The new date or time is not valid." };
    nextInterviewStatus = "RESCHEDULED";
    nextAppStatus = "INTERVIEW_SCHEDULED";
    eventType = "INTERVIEW_RESCHEDULED";
    summary = `Interview rescheduled to ${scheduledAt.toISOString()}`;
  } else if (action === "cancel") {
    nextInterviewStatus = "CANCELLED";
    cancellationReason = String(formData?.get("cancellationReason") || "Cancelled by recruitment team");
    eventType = "INTERVIEW_CANCELLED";
    summary = "Interview cancelled";
    nextAppStatus = "SHORTLISTED";
  } else if (action === "attended") {
    nextInterviewStatus = "ATTENDED";
    nextAppStatus = "INTERVIEWED";
    eventType = "INTERVIEW_ATTENDED";
    summary = "Interview marked as attended";
  } else {
    nextInterviewStatus = "NO_SHOW";
    nextAppStatus = "NO_SHOW";
    eventType = "INTERVIEW_NO_SHOW";
    summary = "Candidate marked as no-show";
  }

  await prisma.$transaction(async (tx) => {
    await tx.interview.update({
      where: { id: interviewId },
      data: {
        status: nextInterviewStatus,
        scheduledAt,
        cancellationReason,
        location: formData?.get("location") ? String(formData.get("location")) : interview.location,
        meetingUrl: formData?.get("meetingUrl") ? String(formData.get("meetingUrl")) : interview.meetingUrl,
        candidateInstruction: formData?.get("candidateInstruction")
          ? String(formData.get("candidateInstruction"))
          : interview.candidateInstruction,
      },
    });
    if (nextAppStatus) {
      await tx.application.update({ where: { id: interview.applicationId }, data: { status: nextAppStatus } });
    }
    await recordActivity(tx, {
      applicationId: interview.applicationId,
      actorId: session.sub,
      eventType,
      summary,
      metadata: { interviewId },
    });
  });

  if (action === "reschedule" || action === "cancel") {
    void sendInterviewEmail({
      kind: action === "cancel" ? "cancelled" : "rescheduled",
      to: interview.application.email,
      candidateName: interview.application.candidateName,
      jobTitle: interview.application.job.title,
      companyName: interview.application.job.company.name,
      scheduledAt,
      mode: interview.mode,
      location: interview.location,
      meetingUrl: interview.meetingUrl,
      instruction: interview.candidateInstruction,
      reference: interview.application.publicReference,
    });
  }

  touch(["/admin", "/admin/interviews", `/admin/applications/${interview.applicationId}`]);
  return { ok: true };
}

export async function markApplicationOpenedAction(applicationId: string) {
  const session = await requireAdminSession();
  const application = await prisma.application.findUnique({ where: { id: applicationId } });
  if (!application || application.status !== "NEW") return;
  await prisma.$transaction(async (tx) => {
    await tx.application.update({ where: { id: applicationId }, data: { status: "REVIEWING" } });
    await recordActivity(tx, {
      applicationId,
      actorId: session.sub,
      eventType: "APPLICATION_OPENED",
      summary: "Application opened for review",
    });
  });
}
