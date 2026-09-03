import { Resend } from "resend";
import { INTERVIEW_MODE_LABELS, INTERVIEW_MODES } from "./constants";

type Mail = { to: string; subject: string; html: string; text: string };

function isProductionRuntime() {
  return process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
}

async function sendMail(mail: Mail) {
  const from = process.env.EMAIL_FROM || "TrueHire <hello@example.com>";
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (isProductionRuntime()) {
      console.error("[email:error] RESEND_API_KEY is required in production");
      return { ok: false as const, mocked: false };
    }
    console.info("[email:console]", { from, to: mail.to, subject: mail.subject, text: mail.text });
    return { ok: true as const, mocked: true };
  }
  try {
    const result = await new Resend(key).emails.send({ from, to: mail.to, subject: mail.subject, html: mail.html, text: mail.text });
    if (result.error) {
      console.error("[email:error]", result.error);
      return { ok: false as const, mocked: false };
    }
    return { ok: true as const, mocked: false };
  } catch (error) {
    console.error("[email:error]", error);
    return { ok: false as const, mocked: false };
  }
}

function wrap(title: string, body: string) {
  return `<div style="background:#F7F7F7;padding:24px 12px;font-family:Georgia,serif;color:#0A0A0A;"><div style="max-width:560px;margin:0 auto;background:#FFFFFF;border:1px solid #E4E4E4;padding:28px 24px;"><p style="letter-spacing:.16em;font-size:12px;text-transform:uppercase;color:#3A83F6;">TrueHire</p><h1 style="font-size:22px;color:#0A0A0A;">${title}</h1>${body}</div></div>`;
}
function esc(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendApplicationSubmittedEmail(input: {
  to: string; candidateName: string; jobTitle: string; companyName: string; reference: string;
}) {
  const text = `Hello ${input.candidateName},\nYour application for ${input.jobTitle} at ${input.companyName} was submitted.\nReference: ${input.reference}\nThis confirmation does not guarantee a response.`;
  return sendMail({
    to: input.to,
    subject: `Application received — ${input.reference}`,
    text,
    html: wrap("Application successfully submitted", `<p>Hello ${esc(input.candidateName)},</p><p>Your application for <strong>${esc(input.jobTitle)}</strong> at <strong>${esc(input.companyName)}</strong> has been received.</p><p>Reference <strong>${esc(input.reference)}</strong></p><p>This confirmation does not guarantee an interview or a further response.</p>`),
  });
}

export async function sendInterviewEmail(input: {
  kind: "scheduled" | "rescheduled" | "cancelled";
  to: string; candidateName: string; jobTitle: string; companyName: string; scheduledAt: Date;
  mode: (typeof INTERVIEW_MODES)[number]; location?: string | null; meetingUrl?: string | null;
  instruction?: string | null; reference: string;
}) {
  const when = new Intl.DateTimeFormat("en-GB", {
    weekday: "long", day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Dhaka",
  }).format(input.scheduledAt);
  const titles = { scheduled: "Interview scheduled", rescheduled: "Interview rescheduled", cancelled: "Interview cancelled" };
  const extra = input.kind === "cancelled"
    ? "<p>The interview previously arranged for this application is no longer going ahead.</p>"
    : `<p><strong>When:</strong> ${esc(when)} (Asia/Dhaka)</p><p><strong>Mode:</strong> ${INTERVIEW_MODE_LABELS[input.mode]}</p>${input.location ? `<p><strong>Location:</strong> ${esc(input.location)}</p>` : ""}${input.meetingUrl ? `<p><strong>Meeting link:</strong> ${esc(input.meetingUrl)}</p>` : ""}${input.instruction ? `<p>${esc(input.instruction)}</p>` : ""}`;
  return sendMail({
    to: input.to,
    subject: `${titles[input.kind]} — ${input.jobTitle}`,
    text: `${titles[input.kind]} for ${input.jobTitle} (${input.reference})`,
    html: wrap(titles[input.kind], `<p>Hello ${esc(input.candidateName)},</p><p>This update concerns ${esc(input.jobTitle)} at ${esc(input.companyName)} (${esc(input.reference)}).</p>${extra}`),
  });
}
