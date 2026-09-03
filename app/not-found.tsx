import Link from "next/link";
import { SiteFooter, SiteHeader } from "@/components/site-header";
export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-10 sm:py-14">
        <h1 className="serif page-title">Page not found</h1>
        <p className="mt-3 text-sm text-muted">The page you requested is not available.</p>
        <Link href="/jobs" className="mt-5 inline-flex text-sm text-brand hover:underline">View open jobs</Link>
      </main>
      <SiteFooter />
    </>
  );
}
