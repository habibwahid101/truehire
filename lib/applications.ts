import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { recordActivity } from "./activity";
import { sendApplicationSubmittedEmail } from "./email";
import { applicationSubmitSchema } from "./validation";
import { isJobOpen, normalizeEmail, normalizePhone } from "./utils";

export async function submitApplication(raw: unknown) {
  const parsed = applicationSubmitSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false as const, status: 400, error: "Please check the highlighted fields and try again.", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  const data = parsed.data;
  const job = await prisma.job.findUnique({ where: { id: data.jobId }, include: { company: true, questions: true } });
  if (!job || !isJobOpen(job)) return { ok: false as const, status: 409, error: "This role is no longer accepting applications." };

  const emailNormalized = normalizeEmail(data.email);
  const phoneNormalized = normalizePhone(data.phone);
  const duplicate = await prisma.application.findFirst({
    where: { jobId: job.id, OR: [{ emailNormalized }, { phoneNormalized }] },
    select: { publicReference: true },
  });
  if (duplicate) {
    return { ok: false as const, status: 409, error: `An application for this role already exists (${duplicate.publicReference}).` };
  }
  for (const question of job.questions) {
    if (question.required && !(data.answers[question.id] || "").trim()) {
      return { ok: false as const, status: 400, error: `Please answer: ${question.question}` };
    }
  }

  try {
    const created = await prisma.$transaction(async (tx) => {
      const year = new Date().getUTCFullYear();
      const counter = await tx.applicationCounter.upsert({
        where: { year },
        create: { year, last: 1 },
        update: { last: { increment: 1 } },
      });
      const reference = `TH-${year}-${String(counter.last).padStart(6, "0")}`;
      const application = await tx.application.create({
        data: {
          publicReference: reference,
          jobId: job.id,
          candidateName: data.candidateName,
          phone: data.phone,
          phoneNormalized,
          email: data.email,
          emailNormalized,
          currentLocation: data.currentLocation,
          permanentAddress: data.permanentAddress || null,
          highestEducation: data.highestEducation,
          institution: data.institution || null,
          subjectMajor: data.subjectMajor || null,
          employmentStatus: data.employmentStatus,
          currentCompany: data.currentCompany || null,
          currentDesignation: data.currentDesignation || null,
          totalExperienceYrs: data.totalExperienceYrs,
          relevantExperience: data.relevantExperience || null,
          skills: data.skills,
          currentSalary: data.currentSalary ?? null,
          expectedSalary: data.expectedSalary ?? null,
          noticePeriod: data.noticePeriod || null,
          earliestJoinDate: data.earliestJoinDate ? new Date(data.earliestJoinDate) : null,
          suitability: data.suitability,
          linkedinUrl: data.linkedinUrl || null,
          portfolioUrl: data.portfolioUrl || null,
          cvKey: data.cvKey,
          cvFileName: data.cvFileName,
          cvMimeType: data.cvMimeType,
          supportingKey: data.supportingKey || null,
          supportingFileName: data.supportingFileName || null,
          termsAccepted: true,
          accuracyConfirmed: true,
          consentAccepted: true,
          answers: {
            create: job.questions.map((q) => ({ questionId: q.id, value: (data.answers[q.id] || "").trim() })).filter((row) => row.value),
          },
        },
      });
      await recordActivity(tx, { applicationId: application.id, eventType: "APPLICATION_SUBMITTED", summary: "Application submitted", metadata: { reference } });
      return application;
    });
    void sendApplicationSubmittedEmail({
      to: created.email,
      candidateName: created.candidateName,
      jobTitle: job.title,
      companyName: job.company.name,
      reference: created.publicReference,
    });
    return { ok: true as const, reference: created.publicReference };
  } catch (error) {
    console.error("[application:submit]", error);
    return { ok: false as const, status: 500, error: "We could not save your application. Please try again." };
  }
}

export type Tx = Prisma.TransactionClient;
