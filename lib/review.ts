/** Isolated review-mode switch. Set TRUEHIRE_DATA_SOURCE=live to use Prisma only. */
export function isReviewUi() {
  return process.env.TRUEHIRE_DATA_SOURCE !== "live";
}

function isProductionBuild() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

/**
 * Choose live or fixture data after both sides already satisfy the same UI contract T.
 * Do not pass raw Prisma models and raw fixtures here — map first.
 *
 * Production runtime uses live data only when TRUEHIRE_DATA_SOURCE=live.
 * Vercel production *builds* must not require a reachable database.
 */
export async function liveOrFixture<T>(live: () => Promise<T>, fixture: T): Promise<T> {
  if (process.env.TRUEHIRE_DATA_SOURCE === "live" && !isProductionBuild()) return live();
  if (process.env.TRUEHIRE_DATA_SOURCE === "fixtures" || isProductionBuild()) return fixture;
  try {
    return await live();
  } catch {
    return fixture;
  }
}
