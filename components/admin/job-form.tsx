"use client";

import { useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import {
  EMPLOYMENT_LABELS, EMPLOYMENT_TYPES, QUESTION_TYPE_LABELS, QUESTION_TYPES,
  WORKPLACE_LABELS, WORKPLACE_TYPES,
  type EmploymentTypeValue, type QuestionTypeValue, type WorkplaceTypeValue,
} from "@/lib/constants";

type QuestionDraft = { id?: string; question: string; type: QuestionTypeValue; options: string; required: boolean };

export type JobFormCompany = { id: string; name: string };
export type JobFormValues = {
  companyId: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  location: string;
  workplaceType: WorkplaceTypeValue;
  employmentType: EmploymentTypeValue;
  vacancyCount: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  salaryDisplay?: string | null;
  salaryNegotiable?: boolean;
  educationRequirement?: string | null;
  experienceRequirement?: string | null;
  relevantExperience?: string | null;
  skills: string[];
  responsibilities: string;
  preferredQualifications?: string | null;
  benefits?: string | null;
  workingDays?: string | null;
  workingHours?: string | null;
  probation?: string | null;
  joiningExpectation?: string | null;
  applicationDeadline?: Date | string | null;
  instructions?: string | null;
  terms?: string | null;
  requireLinkedIn?: boolean;
  requirePortfolio?: boolean;
  questions: Array<{ id: string; question: string; type: QuestionTypeValue; options: string[]; required: boolean }>;
};

export function JobForm({
  job, companies, action,
}: {
  job?: JobFormValues;
  companies: JobFormCompany[];
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [error, setError] = useState("");
  const [questions, setQuestions] = useState<QuestionDraft[]>(
    job?.questions.map((q) => ({ id: q.id, question: q.question, type: q.type, options: q.options.join(", "), required: q.required })) || [],
  );
  async function onSubmit(formData: FormData) {
    formData.set("questions", JSON.stringify(questions.filter((q) => q.question.trim()).map((q) => ({
      id: q.id, question: q.question, type: q.type,
      options: q.options.split(",").map((s) => s.trim()).filter(Boolean), required: q.required,
    }))));
    setError("");
    await action(formData);
  }
  const deadline = job?.applicationDeadline ? new Date(job.applicationDeadline).toISOString().slice(0, 10) : "";
  return (
    <form action={onSubmit} className="grid max-w-3xl gap-4">
      <Field label="Company">
        <Select name="companyId" defaultValue={job?.companyId} required>
          <option value="">Select company</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
      </Field>
      <Field label="Job title"><Input name="title" defaultValue={job?.title} required /></Field>
      <Field label="Slug"><Input name="slug" defaultValue={job?.slug} /></Field>
      <Field label="Short summary"><Textarea name="summary" defaultValue={job?.summary} required /></Field>
      <Field label="Description"><Textarea name="description" className="min-h-40" defaultValue={job?.description} required /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location"><Input name="location" defaultValue={job?.location} required /></Field>
        <Field label="Workplace">
          <Select name="workplaceType" defaultValue={job?.workplaceType || "ONSITE"}>
            {WORKPLACE_TYPES.map((t) => <option key={t} value={t}>{WORKPLACE_LABELS[t]}</option>)}
          </Select>
        </Field>
        <Field label="Employment type">
          <Select name="employmentType" defaultValue={job?.employmentType || "FULL_TIME"}>
            {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{EMPLOYMENT_LABELS[t]}</option>)}
          </Select>
        </Field>
        <Field label="Vacancies"><Input name="vacancyCount" type="number" min="1" defaultValue={job?.vacancyCount ?? 1} /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Salary min"><Input name="salaryMin" type="number" defaultValue={job?.salaryMin ?? ""} /></Field>
        <Field label="Salary max"><Input name="salaryMax" type="number" defaultValue={job?.salaryMax ?? ""} /></Field>
        <Field label="Salary display"><Input name="salaryDisplay" defaultValue={job?.salaryDisplay ?? ""} /></Field>
      </div>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="salaryNegotiable" defaultChecked={job?.salaryNegotiable} /> Salary negotiable</label>
      <Field label="Education requirement"><Input name="educationRequirement" defaultValue={job?.educationRequirement ?? ""} /></Field>
      <Field label="Experience requirement"><Input name="experienceRequirement" defaultValue={job?.experienceRequirement ?? ""} /></Field>
      <Field label="Relevant experience"><Input name="relevantExperience" defaultValue={job?.relevantExperience ?? ""} /></Field>
      <Field label="Skills" hint="Comma separated"><Input name="skills" defaultValue={job?.skills.join(", ") ?? ""} /></Field>
      <Field label="Responsibilities"><Textarea name="responsibilities" className="min-h-40" defaultValue={job?.responsibilities} required /></Field>
      <Field label="Preferred qualifications"><Textarea name="preferredQualifications" defaultValue={job?.preferredQualifications ?? ""} /></Field>
      <Field label="Benefits"><Textarea name="benefits" defaultValue={job?.benefits ?? ""} /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Working days"><Input name="workingDays" defaultValue={job?.workingDays ?? ""} /></Field>
        <Field label="Working hours"><Input name="workingHours" defaultValue={job?.workingHours ?? ""} /></Field>
        <Field label="Probation"><Input name="probation" defaultValue={job?.probation ?? ""} /></Field>
        <Field label="Joining expectation"><Input name="joiningExpectation" defaultValue={job?.joiningExpectation ?? ""} /></Field>
        <Field label="Application deadline"><Input name="applicationDeadline" type="date" defaultValue={deadline} /></Field>
      </div>
      <Field label="Application instructions"><Textarea name="instructions" defaultValue={job?.instructions ?? ""} /></Field>
      <Field label="Terms and conditions"><Textarea name="terms" className="min-h-32" defaultValue={job?.terms ?? ""} /></Field>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="requireLinkedIn" defaultChecked={job?.requireLinkedIn} /> Require LinkedIn URL</label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="requirePortfolio" defaultChecked={job?.requirePortfolio} /> Require portfolio URL</label>
      <div className="border border-line p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Screening questions</h3>
          <button type="button" className="text-sm text-brand" onClick={() => setQuestions((c) => [...c, { question: "", type: "SHORT_TEXT", options: "", required: true }])}>Add question</button>
        </div>
        <div className="mt-4 grid gap-4">
          {questions.map((question, index) => (
            <div key={index} className="grid gap-2 border-t border-line pt-4">
              <Input value={question.question} onChange={(e) => setQuestions((c) => c.map((item, i) => i === index ? { ...item, question: e.target.value } : item))} placeholder="Question" />
              <div className="grid gap-2 sm:grid-cols-2">
                <Select value={question.type} onChange={(e) => setQuestions((c) => c.map((item, i) => i === index ? { ...item, type: e.target.value as QuestionDraft["type"] } : item))}>
                  {QUESTION_TYPES.map((t) => <option key={t} value={t}>{QUESTION_TYPE_LABELS[t]}</option>)}
                </Select>
                <Input value={question.options} onChange={(e) => setQuestions((c) => c.map((item, i) => i === index ? { ...item, options: e.target.value } : item))} placeholder="Options, comma separated" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={question.required} onChange={(e) => setQuestions((c) => c.map((item, i) => i === index ? { ...item, required: e.target.checked } : item))} />
                Required
              </label>
            </div>
          ))}
        </div>
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button type="submit">Save job</Button>
    </form>
  );
}
