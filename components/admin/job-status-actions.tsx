import { duplicateJobAction, setJobStatusAction } from "@/lib/actions/jobs";
import { Button } from "@/components/ui/button";
import type { JobStatusValue } from "@/lib/constants";

export function JobStatusActions({ id, status, slug }: { id: string; status: JobStatusValue; slug: string }) {
  async function publish() { "use server"; await setJobStatusAction(id, "PUBLISHED"); }
  async function unpublish() { "use server"; await setJobStatusAction(id, "DRAFT"); }
  async function close() { "use server"; await setJobStatusAction(id, "CLOSED"); }
  async function duplicate() { "use server"; await duplicateJobAction(id); }
  return (
    <div className="flex flex-wrap gap-2">
      {status !== "PUBLISHED" ? <form action={publish}><Button type="submit" size="sm">Publish</Button></form> : <form action={unpublish}><Button type="submit" size="sm" variant="secondary">Unpublish</Button></form>}
      {status !== "CLOSED" ? <form action={close}><Button type="submit" size="sm" variant="secondary">Close</Button></form> : null}
      <form action={duplicate}><Button type="submit" size="sm" variant="ghost">Duplicate</Button></form>
      {status === "PUBLISHED" ? <a href={`/jobs/${slug}`} className="inline-flex h-9 items-center px-3 text-sm text-brand" target="_blank" rel="noreferrer">Preview</a> : null}
    </div>
  );
}
