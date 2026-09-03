import Link from "next/link";
import { ReviewBanner } from "@/components/review-banner";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-surface/94 backdrop-blur">
      <ReviewBanner />
      <div className="container-page flex h-12 items-center justify-between sm:h-14">
        <Link href="/" className="serif text-[20px] tracking-tight text-ink sm:text-[22px]">TrueHire</Link>
        <nav className="flex items-center gap-4 text-sm text-muted sm:gap-6">
          <Link href="/jobs" className="hover:text-ink">Open jobs</Link>
          {!compact ? <Link href="/contact" className="hidden hover:text-ink sm:inline">Contact</Link> : null}
        </nav>
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
