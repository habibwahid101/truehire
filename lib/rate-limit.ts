type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  if (current.count >= limit) return { ok: false };
  current.count += 1;
  return { ok: true };
}
export function clientKey(request: Request, prefix: string) {
  const fwd = request.headers.get("x-forwarded-for");
  const ip = fwd?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return `${prefix}:${ip}`;
}
