import { cn } from "@/lib/utils";
import {
  APPLICATION_STATUS_LABELS, INTERVIEW_STATUS_LABELS, JOB_STATUS_LABELS,
  type ApplicationStatusValue, type JobStatusValue,
} from "@/lib/constants";

const tone: Record<string, string> = {
  NEW: "bg-info-soft text-info",
  REVIEWING: "bg-warning-soft text-warning",
  SHORTLISTED: "bg-brand-soft text-brand",
  INTERVIEW_SCHEDULED: "bg-brand-soft text-brand",
  INTERVIEWED: "bg-success-soft text-success",
  SELECTED: "bg-success-soft text-success",
  HOLD: "bg-warning-soft text-warning",
  REJECTED: "bg-danger-soft text-danger",
  NO_SHOW: "bg-danger-soft text-danger",
  DRAFT: "bg-[#eeeae3] text-muted",
  PUBLISHED: "bg-success-soft text-success",
  CLOSED: "bg-danger-soft text-danger",
  ACTIVE: "bg-success-soft text-success",
  INACTIVE: "bg-[#eeeae3] text-muted",
  SCHEDULED: "bg-brand-soft text-brand",
  RESCHEDULED: "bg-warning-soft text-warning",
  CANCELLED: "bg-[#eeeae3] text-muted",
  ATTENDED: "bg-success-soft text-success",
};

export function StatusBadge({ value }: { value: string }) {
  const label =
    APPLICATION_STATUS_LABELS[value as ApplicationStatusValue] ||
    JOB_STATUS_LABELS[value as JobStatusValue] ||
    INTERVIEW_STATUS_LABELS[value as keyof typeof INTERVIEW_STATUS_LABELS] ||
    value.replaceAll("_", " ").toLowerCase();
  return (
    <span className={cn("inline-flex items-center rounded-sm px-2 py-0.5 text-xs font-medium", tone[value] || "bg-[#eeeae3] text-muted")}>
      {label}
    </span>
  );
}
