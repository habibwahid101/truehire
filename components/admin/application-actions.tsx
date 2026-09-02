import { updateApplicationStatusAction } from "@/lib/actions/recruitment";
import { APPLICATION_STATUS_LABELS, APPLICATION_STATUSES, type ApplicationStatusValue } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export function ApplicationStatusForm({ applicationId, status }: { applicationId: string; status: ApplicationStatusValue }) {
  async function action(formData: FormData) {
    "use server";
    const next = String(formData.get("status"));
    if (!APPLICATION_STATUSES.includes(next as ApplicationStatusValue)) return;
    await updateApplicationStatusAction(applicationId, next as ApplicationStatusValue);
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
