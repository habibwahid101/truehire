import { saveEvaluationAction } from "@/lib/actions/recruitment";
import { Field, Input, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export type EvaluationFormValues = {
  rating?: number | null;
  strengths?: string | null;
  concerns?: string | null;
  internalNote?: string | null;
  recommendedAction?: string | null;
};

export function EvaluationForm({ applicationId, evaluation }: { applicationId: string; evaluation: EvaluationFormValues | null }) {
  return (
    <form action={saveEvaluationAction.bind(null, applicationId)} className="grid gap-3">
      <Field label="Rating (1–5)"><Input name="rating" type="number" min="1" max="5" defaultValue={evaluation?.rating ?? ""} /></Field>
      <Field label="Strengths"><Textarea name="strengths" defaultValue={evaluation?.strengths ?? ""} /></Field>
      <Field label="Concerns"><Textarea name="concerns" defaultValue={evaluation?.concerns ?? ""} /></Field>
      <Field label="Internal note"><Textarea name="internalNote" defaultValue={evaluation?.internalNote ?? ""} /></Field>
      <Field label="Recommended next action"><Input name="recommendedAction" defaultValue={evaluation?.recommendedAction ?? ""} /></Field>
      <Button type="submit" size="sm">Save evaluation</Button>
    </form>
  );
}
