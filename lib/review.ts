/** Isolated review-mode switch. Set TRUEHIRE_DATA_SOURCE=live to use Prisma only. */
export function isReviewUi() {
  return process.env.TRUEHIRE_DATA_SOURCE !== "live";
}

function requireLive() {
  return process.env.TRUEHIRE_DATA_SOURCE === "live" || process.env.VERCEL_ENV === "production";
}

/**
 * Choose live or fixture data after both sides already satisfy the same UI contract T.
 * Do not pass raw Prisma models and raw fixtures here — map first.
 */
export async function liveOrFixture<T>(live: () => Promise<T>, fixture: T): Promise<T> {
  if (process.env.TRUEHIRE_DATA_SOURCE === "fixtures" && process.env.VERCEL_ENV !== "production") return fixture;
  if (requireLive()) return live();
  try {
    return await live();
  } catch {
    return fixture;
  }
}
