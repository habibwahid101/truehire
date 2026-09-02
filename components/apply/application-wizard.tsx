"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Job, JobQuestion } from "@prisma/client";
import { Field, Input, Select, Textarea, Checkbox } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { EDUCATION_OPTIONS, EMPLOYMENT_STATUS_OPTIONS } from "@/lib/constants";

type Props = {
  job: Pick<Job, "id" | "title" | "requireLinkedIn" | "requirePortfolio" | "terms"> & {
    companyName: string;
    questions: JobQuestion[];
  };
};

type FormState = {
  candidateName: string; phone: string; email: string; currentLocation: string; permanentAddress: string;
  highestEducation: string; institution: string; subjectMajor: string; employmentStatus: string;
  currentCompany: string; currentDesignation: string; totalExperienceYrs: string; relevantExperience: string;
  skills: string; currentSalary: string; expectedSalary: string; noticePeriod: string; earliestJoinDate: string;
  suitability: string; answers: Record<string, string>; linkedinUrl: string; portfolioUrl: string;
  cvKey: string; cvFileName: string; cvMimeType: string; supportingKey: string; supportingFileName: string;
  termsAccepted: boolean; accuracyConfirmed: boolean; consentAccepted: boolean;
};

const steps = ["Personal", "Career", "Job fit", "Documents", "Review"];
const empty = (job: Props["job"]): FormState => ({
  candidateName: "", phone: "", email: "", currentLocation: "", permanentAddress: "",
  highestEducation: "", institution: "", subjectMajor: "", employmentStatus: "",
  currentCompany: "", currentDesignation: "", totalExperienceYrs: "", relevantExperience: "",
  skills: "", currentSalary: "", expectedSalary: "", noticePeriod: "", earliestJoinDate: "",
  suitability: "", answers: Object.fromEntries(job.questions.map((q) => [q.id, ""])),
  linkedinUrl: "", portfolioUrl: "", cvKey: "", cvFileName: "", cvMimeType: "",
  supportingKey: "", supportingFileName: "", termsAccepted: false, accuracyConfirmed: false, consentAccepted: false,
});

export function ApplicationWizard({ job }: Props) {
  const router = useRouter();
  const storageKey = useMemo(() => `th-apply-${job.id}`, [job.id]);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(() => empty(job));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setForm({ ...empty(job), ...JSON.parse(raw) });
    } catch { /* ignore */ }
  }, [job, storageKey]);
  useEffect(() => { sessionStorage.setItem(storageKey, JSON.stringify(form)); }, [form, storageKey]);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validateStep(index: number) {
    const next: Record<string, string> = {};
    if (index === 0) {
      if (form.candidateName.trim().length < 2) next.candidateName = "Enter your full name.";
      if (form.phone.trim().length < 8) next.phone = "Enter a valid mobile number.";
      if (!/[^\s@]+@[^\s@]+\.[^\s@]+/.test(form.email) === false && !/^[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(form.email)) next.email = "Enter a valid email address.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email address.";
      if (form.currentLocation.trim().length < 2) next.currentLocation = "Enter your current location.";
    }
    if (index === 1) {
      if (!form.highestEducation) next.highestEducation = "Select your highest education.";
      if (!form.employmentStatus) next.employmentStatus = "Select your employment status.";
      if (form.totalExperienceYrs === "" || Number(form.totalExperienceYrs) < 0) next.totalExperienceYrs = "Enter years of experience.";
    }
    if (index === 2) {
      if (form.skills.trim().length < 2) next.skills = "List a few key skills.";
      if (form.suitability.trim().length < 30) next.suitability = "Please write a little more about your suitability.";
      for (const question of job.questions) {
        if (question.required && !form.answers[question.id]?.trim()) next[`q-${question.id}`] = "This question is required.";
      }
    }
    if (index === 3) {
      if (!form.cvKey) next.cv = "Upload your CV.";
      if (job.requireLinkedIn && !form.linkedinUrl) next.linkedinUrl = "A LinkedIn URL is required for this role.";
      if (job.requirePortfolio && !form.portfolioUrl) next.portfolioUrl = "A portfolio URL is required for this role.";
    }
    if (index === 4) {
      if (!form.termsAccepted) next.termsAccepted = "Please confirm you have read the role and terms.";
      if (!form.accuracyConfirmed) next.accuracyConfirmed = "Please confirm the information is accurate.";
      if (!form.consentAccepted) next.consentAccepted = "Consent is required to submit.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function upload(file: File, kind: "cv" | "supporting") {
    setUploadError("");
    const body = new FormData();
    body.append("file", file);
    body.append("kind", kind);
    const res = await fetch("/api/applications/upload", { method: "POST", body });
    const json = await res.json();
    if (!res.ok) { setUploadError(json.error || "Upload failed."); return; }
    if (kind === "cv") setForm((c) => ({ ...c, cvKey: json.key, cvFileName: json.fileName, cvMimeType: json.mimeType }));
    else setForm((c) => ({ ...c, supportingKey: json.key, supportingFileName: json.fileName }));
  }

  async function submit() {
    if (!validateStep(4)) return;
    setBusy(true);
    setSubmitError("");
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: job.id, ...form,
        totalExperienceYrs: Number(form.totalExperienceYrs || 0),
        currentSalary: form.currentSalary ? Number(form.currentSalary) : undefined,
        expectedSalary: form.expectedSalary ? Number(form.expectedSalary) : undefined,
      }),
    });
    const json = await res.json();
    setBusy(false);
    if (!res.ok) { setSubmitError(json.error || "We could not submit your application."); return; }
    sessionStorage.removeItem(storageKey);
    router.push(`/application/success/${json.reference}`);
  }

  return (
    <div>
      <ol className="mb-8 flex gap-2 overflow-x-auto pb-1 text-xs uppercase tracking-[0.12em] text-faint">
        {steps.map((label, index) => (
          <li key={label} className={index === step ? "shrink-0 text-brand" : index < step ? "shrink-0 text-ink" : "shrink-0"}>
            {String(index + 1).padStart(2, "0")} {label}
          </li>
        ))}
      </ol>
      {step === 0 && (
        <div className="grid gap-4">
          <Field label="Full name" error={errors.candidateName}><Input value={form.candidateName} onChange={(e) => set("candidateName", e.target.value)} autoComplete="name" /></Field>
          <Field label="Mobile number" error={errors.phone}><Input value={form.phone} onChange={(e) => set("phone", e.target.value)} inputMode="tel" autoComplete="tel" /></Field>
          <Field label="Email address" error={errors.email}><Input value={form.email} onChange={(e) => set("email", e.target.value)} type="email" autoComplete="email" /></Field>
          <Field label="Current location" error={errors.currentLocation}><Input value={form.currentLocation} onChange={(e) => set("currentLocation", e.target.value)} /></Field>
          <Field label="Permanent address (optional)"><Input value={form.permanentAddress} onChange={(e) => set("permanentAddress", e.target.value)} /></Field>
        </div>
      )}
      {step === 1 && (
        <div className="grid gap-4">
          <Field label="Highest education" error={errors.highestEducation}>
            <Select value={form.highestEducation} onChange={(e) => set("highestEducation", e.target.value)}>
              <option value="">Select</option>
              {EDUCATION_OPTIONS.map((item) => <option key={item}>{item}</option>)}
            </Select>
          </Field>
          <Field label="Institution"><Input value={form.institution} onChange={(e) => set("institution", e.target.value)} /></Field>
          <Field label="Subject / major"><Input value={form.subjectMajor} onChange={(e) => set("subjectMajor", e.target.value)} /></Field>
          <Field label="Current employment status" error={errors.employmentStatus}>
            <Select value={form.employmentStatus} onChange={(e) => set("employmentStatus", e.target.value)}>
              <option value="">Select</option>
              {EMPLOYMENT_STATUS_OPTIONS.map((item) => <option key={item}>{item}</option>)}
            </Select>
          </Field>
          <Field label="Current company"><Input value={form.currentCompany} onChange={(e) => set("currentCompany", e.target.value)} /></Field>
          <Field label="Current designation"><Input value={form.currentDesignation} onChange={(e) => set("currentDesignation", e.target.value)} /></Field>
          <Field label="Total professional experience (years)" error={errors.totalExperienceYrs}>
            <Input type="number" min="0" step="0.5" value={form.totalExperienceYrs} onChange={(e) => set("totalExperienceYrs", e.target.value)} />
          </Field>
          <Field label="Relevant experience"><Textarea value={form.relevantExperience} onChange={(e) => set("relevantExperience", e.target.value)} /></Field>
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-4">
          <Field label="Key skills" error={errors.skills}><Input value={form.skills} onChange={(e) => set("skills", e.target.value)} /></Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Current salary (BDT, optional)"><Input type="number" min="0" value={form.currentSalary} onChange={(e) => set("currentSalary", e.target.value)} /></Field>
            <Field label="Expected salary (BDT, optional)"><Input type="number" min="0" value={form.expectedSalary} onChange={(e) => set("expectedSalary", e.target.value)} /></Field>
          </div>
          <Field label="Notice period"><Input value={form.noticePeriod} onChange={(e) => set("noticePeriod", e.target.value)} /></Field>
          <Field label="Earliest joining date"><Input type="date" value={form.earliestJoinDate} onChange={(e) => set("earliestJoinDate", e.target.value)} /></Field>
          <Field label="Why are you suitable for this position?" error={errors.suitability}><Textarea value={form.suitability} onChange={(e) => set("suitability", e.target.value)} /></Field>
          {job.questions.map((question) => (
            <Field key={question.id} label={question.question + (question.required ? "" : " (optional)")} error={errors[`q-${question.id}`]}>
              {question.type === "LONG_TEXT" ? (
                <Textarea value={form.answers[question.id] || ""} onChange={(e) => set("answers", { ...form.answers, [question.id]: e.target.value })} />
              ) : question.type === "YES_NO" || question.type === "SINGLE_CHOICE" ? (
                <Select value={form.answers[question.id] || ""} onChange={(e) => set("answers", { ...form.answers, [question.id]: e.target.value })}>
                  <option value="">Select</option>
                  {(question.type === "YES_NO" ? ["Yes", "No"] : question.options).map((option) => <option key={option}>{option}</option>)}
                </Select>
              ) : (
                <Input type={question.type === "NUMERIC" ? "number" : "text"} value={form.answers[question.id] || ""} onChange={(e) => set("answers", { ...form.answers, [question.id]: e.target.value })} />
              )}
            </Field>
          ))}
        </div>
      )}
      {step === 3 && (
        <div className="grid gap-4">
          <Field label="CV / resume" hint="PDF, DOC or DOCX. Maximum 8 MB." error={errors.cv}>
            <Input type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file, "cv"); }} />
            {form.cvFileName ? <p className="text-sm text-success">Uploaded: {form.cvFileName}</p> : null}
          </Field>
          <Field label="Supporting document (optional)">
            <Input type="file" accept=".pdf,.doc,.docx,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) void upload(file, "supporting"); }} />
            {form.supportingFileName ? <p className="text-sm text-success">Uploaded: {form.supportingFileName}</p> : null}
          </Field>
          {uploadError ? <p className="text-sm text-danger">{uploadError}</p> : null}
          <Field label={job.requireLinkedIn ? "LinkedIn URL" : "LinkedIn URL (optional)"} error={errors.linkedinUrl}>
            <Input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
          </Field>
          <Field label={job.requirePortfolio ? "Portfolio URL" : "Portfolio URL (optional)"} error={errors.portfolioUrl}>
            <Input value={form.portfolioUrl} onChange={(e) => set("portfolioUrl", e.target.value)} />
          </Field>
        </div>
      )}
      {step === 4 && (
        <div className="space-y-6">
          <div className="border border-line bg-surface p-5 text-sm">
            <h3 className="serif text-xl">Review</h3>
            <p className="mt-1 text-muted">{job.title} · {job.companyName}</p>
            <dl className="mt-4 grid gap-2">
              <div><span className="text-muted">Name.</span> {form.candidateName}</div>
              <div><span className="text-muted">Contact.</span> {form.email} · {form.phone}</div>
              <div><span className="text-muted">Location.</span> {form.currentLocation}</div>
              <div><span className="text-muted">Education.</span> {form.highestEducation} {form.institution}</div>
              <div><span className="text-muted">Experience.</span> {form.totalExperienceYrs} years · {form.employmentStatus}</div>
              <div><span className="text-muted">Skills.</span> {form.skills}</div>
              <div><span className="text-muted">CV.</span> {form.cvFileName}</div>
            </dl>
          </div>
          {job.terms ? <div className="max-h-40 overflow-auto whitespace-pre-wrap border border-line p-4 text-sm text-muted">{job.terms}</div> : null}
          <Checkbox label="I have read and understood the job description, requirements and applicable terms and conditions." checked={form.termsAccepted} onChange={(e) => set("termsAccepted", e.target.checked)} error={errors.termsAccepted} />
          <Checkbox label="I confirm that the information I have provided is accurate to the best of my knowledge." checked={form.accuracyConfirmed} onChange={(e) => set("accuracyConfirmed", e.target.checked)} error={errors.accuracyConfirmed} />
          <Checkbox label="I consent to TrueHire processing my submitted information for recruitment-related purposes." checked={form.consentAccepted} onChange={(e) => set("consentAccepted", e.target.checked)} error={errors.consentAccepted} />
          {submitError ? <p className="text-sm text-danger">{submitError}</p> : null}
        </div>
      )}
      <div className="mt-8 flex items-center justify-between gap-3">
        <Button type="button" variant="secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || busy}>Back</Button>
        {step < 4 ? (
          <Button type="button" onClick={() => { if (validateStep(step)) setStep((s) => s + 1); }}>Continue</Button>
        ) : (
          <Button type="button" onClick={() => void submit()} disabled={busy}>{busy ? "Submitting…" : "Submit application"}</Button>
        )}
      </div>
    </div>
  );
}
