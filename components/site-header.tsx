import Link from "next/link";
import { ReviewBanner } from "@/components/review-banner";
import { SiteNav } from "@/components/site-nav";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface">
      <ReviewBanner />
      <div className="container-page flex h-11 items-center justify-between sm:h-12">
        <Link href="/" className="serif text-[19px] leading-none tracking-tight text-ink sm:text-[21px]">TrueHire</Link>
        <SiteNav compact={compact} />
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-10 border-t border-line sm:mt-14">
      <div className="container-page flex flex-col gap-3 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:py-7">
        <p>TrueHire · Structured recruitment</p>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/jobs">Open jobs</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </footer>
  );
}
