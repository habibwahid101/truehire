import Link from "next/link";
import { logoutAction } from "@/lib/actions/auth";
import type { AdminSession } from "@/lib/session";

const links = [
  ["Dashboard", "/admin"],
  ["Jobs", "/admin/jobs"],
  ["Applications", "/admin/applications"],
  ["Interviews", "/admin/interviews"],
  ["Companies", "/admin/companies"],
];

export function AdminShell({ session, children }: { session: AdminSession; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex h-14 w-[min(1200px,calc(100%-24px))] items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="serif text-lg text-brand">TrueHire</Link>
            <nav className="hidden gap-5 text-sm text-muted md:flex">
              {links.map(([label, href]) => <Link key={href} href={href} className="hover:text-ink">{label}</Link>)}
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-muted sm:inline">{session.name}</span>
            <form action={logoutAction}><button className="text-muted hover:text-ink">Log out</button></form>
          </div>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-line px-4 py-2 text-sm text-muted md:hidden">
          {links.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        </nav>
      </header>
      <div className="mx-auto w-[min(1200px,calc(100%-24px))] py-8">{children}</div>
    </div>
  );
}
