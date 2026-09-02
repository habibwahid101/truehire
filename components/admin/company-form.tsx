import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import type { CompanyStatusValue } from "@/lib/constants";

export type CompanyFormValues = {
  name: string;
  slug: string;
  industry?: string | null;
  website?: string | null;
  location?: string | null;
  overview?: string | null;
  internalNotes?: string | null;
  status?: CompanyStatusValue;
};

export function CompanyForm({
  company, action,
}: { company?: CompanyFormValues; action: (formData: FormData) => void | Promise<void> }) {
  return (
    <form action={action} className="grid max-w-2xl gap-4">
      <Field label="Company name"><Input name="name" defaultValue={company?.name} required /></Field>
      <Field label="Slug" hint="Leave blank to generate from the name."><Input name="slug" defaultValue={company?.slug} /></Field>
      <Field label="Industry"><Input name="industry" defaultValue={company?.industry || ""} /></Field>
      <Field label="Website"><Input name="website" defaultValue={company?.website || ""} /></Field>
      <Field label="Location"><Input name="location" defaultValue={company?.location || ""} /></Field>
      <Field label="Overview"><Textarea name="overview" defaultValue={company?.overview || ""} /></Field>
      <Field label="Internal notes"><Textarea name="internalNotes" defaultValue={company?.internalNotes || ""} /></Field>
      <Field label="Status">
        <Select name="status" defaultValue={company?.status || "ACTIVE"}>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
      </Field>
      <Button type="submit">Save company</Button>
    </form>
  );
}
