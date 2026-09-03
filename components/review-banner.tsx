export function ReviewBanner() {
  const explicit = process.env.TRUEHIRE_SHOW_REVIEW_BANNER === "true";
  const localReview =
    process.env.NODE_ENV !== "production" && process.env.TRUEHIRE_DATA_SOURCE === "fixtures";
  if (!explicit && !localReview) return null;
  return (
    <div className="border-b border-line bg-warning-soft px-3 py-1.5 text-center text-xs text-warning">
      Frontend review build. Screens use isolated fixture data until the live database is connected.
    </div>
  );
}
