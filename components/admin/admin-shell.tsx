import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import { ReviewBanner } from "@/components/review-banner";
import type { AdminSession } from "@/lib/session";

const links = [
  ["Desk", "/admin"],
  ["Jobs", "/admin/jobs"],
  ["Applications", "/admin/applications"],
  ["Interviews", "/admin/interviews"],
  ["Companies", "/admin/companies"],
];

export function AdminShell({ session, children }: { session: AdminSession; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line bg-surface">
        <ReviewBanner />
        <div className="mx-auto flex h-14 w-[min(1200px,calc(100%-20px))] items-center justify-between">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/admin" className="serif text-lg text-brand">TrueHire</Link>
            <nav className="hidden gap-4 text-sm text-muted md:flex">
              {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-ink">{label}</Link>)}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden truncate text-muted sm:inline">{session.name}</span>
            <form action={logoutAction}><button className="text-muted hover:text-ink">Log out</button></form>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-line px-4 py-2 text-sm text-muted md:hidden">
          {links.map(([label, href]) => <Link key={href} href={href} className="shrink-0">{label}</Link>)}
        </nav>
      </header>
      <div className="mx-auto w-[min(1200px,calc(100%-20px))] py-6 sm:py-8">{children}</div>
    </div>
  );
}
