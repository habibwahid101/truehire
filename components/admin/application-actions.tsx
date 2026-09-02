import type { ApplicationStatus } from "@prisma/client";
import { updateApplicationStatusAction } from "@/lib/actions/recruitment";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function ApplicationStatusForm({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) {
  async function action(formData: FormData) {
    "use server";
    await updateApplicationStatusAction(applicationId, String(formData.get("status")) as ApplicationStatus);
  }
  return (
    <form action={action} className="flex flex-wrap items-end gap-2">
      <label className="text-sm">
        <span className="mb-1 block text-muted">Move to</span>
        <select name="status" defaultValue={status} className="h-10 rounded-md border border-line bg-surface px-3">
          {APPLICATION_STATUSES.map((value) => <option key={value} value={value}>{APPLICATION_STATUS_LABELS[value]}</option>)}
        </select>
      </label>
      <Button type="submit" size="sm">Update status</Button>
    </form>
  );
}
