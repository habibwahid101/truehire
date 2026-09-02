import { isReviewUi } from "@/lib/review";

export function ReviewBanner() {
  if (!isReviewUi()) return null;
  return (
    <div className="border-b border-line bg-warning-soft px-3 py-2 text-center text-xs text-warning">
      Frontend review build. Screens use isolated fixture data until the live database is connected.
    </div>
  );
}
