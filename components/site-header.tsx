import Link from "next/link";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className="border-b border-line bg-surface/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="serif text-xl tracking-tight text-brand">TrueHire</Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          <Link href="/jobs" className="hover:text-ink">Open jobs</Link>
          {!compact ? <Link href="/contact" className="hidden hover:text-ink sm:inline">Contact</Link> : null}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="container-page flex flex-col gap-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>TrueHire · Structured recruitment</p>
        <nav className="flex flex-wrap gap-5">
          <a href="/jobs">Open jobs</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </nav>
      </div>
    </footer>
  );
}
