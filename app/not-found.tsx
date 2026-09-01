import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-header";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-20">
        <h1 className="serif text-4xl">Page not found</h1>
        <p className="mt-3 text-muted">The page you requested is not available.</p>
        <Link href="/jobs" className="mt-6 inline-flex text-brand hover:underline">View open jobs</Link>
      </main>
      <SiteFooter />
    </>
  );
}
