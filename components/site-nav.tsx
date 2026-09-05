"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavLink({
  href,
  children,
  emphasis = false,
}: {
  href: string;
  children: React.ReactNode;
  emphasis?: boolean;
}) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`relative inline-flex min-h-9 items-center text-sm transition-colors hover:text-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${active ? "text-ink" : emphasis ? "text-ink" : "text-muted"}`}
    >
      {children}
      {active ? <span className="absolute inset-x-0 -bottom-px h-px bg-brand" aria-hidden="true" /> : null}
    </Link>
  );
}

export function SiteNav({ compact = false }: { compact?: boolean }) {
  return (
    <nav className="flex items-center gap-4 sm:gap-5" aria-label="Primary">
      <NavLink href="/jobs" emphasis>Open jobs</NavLink>
      {!compact ? <NavLink href="/contact">Contact</NavLink> : null}
    </nav>
  );
}
