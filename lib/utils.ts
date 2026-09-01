export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
export function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "").slice(0, 80);
}
export function uniqueSlug(base: string, existing: string[]) {
  const root = slugify(base) || "item";
  if (!existing.includes(root)) return root;
  let i = 2;
  while (existing.includes(`${root}-${i}`)) i += 1;
  return `${root}-${i}`;
}
export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").replace(/^00/, "+");
}
export function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}
export function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Dhaka",
  }).format(date);
}
export function formatSalary(min?: number | null, max?: number | null, display?: string | null, negotiable?: boolean) {
  if (display) return negotiable ? `${display} · Negotiable` : display;
  const fmt = (n: number) => new Intl.NumberFormat("en-BD", { maximumFractionDigits: 0 }).format(n);
  if (min && max) return `BDT ${fmt(min)} – ${fmt(max)}${negotiable ? " · Negotiable" : ""}`;
  if (min) return `From BDT ${fmt(min)}${negotiable ? " · Negotiable" : ""}`;
  if (max) return `Up to BDT ${fmt(max)}${negotiable ? " · Negotiable" : ""}`;
  return negotiable ? "Negotiable" : "Not specified";
}
export function isJobOpen(job: { status: string; applicationDeadline: Date | string | null }) {
  if (job.status !== "PUBLISHED") return false;
  if (!job.applicationDeadline) return true;
  return new Date(job.applicationDeadline).getTime() >= Date.now();
}
export function appUrl(path = "") {
  const base = (process.env.APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
export function fileExtension(name: string) {
  const match = name.toLowerCase().match(/\.[a-z0-9]+$/);
  return match ? match[0] : "";
}
