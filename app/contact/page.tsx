import { SiteFooter, SiteHeader } from "@/components/site-header";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-8 sm:py-12">
        <p className="kicker">Help</p>
        <h1 className="serif page-title mt-2">Contact</h1>
        <p className="mt-3 text-sm leading-6 text-muted">For questions about an application, include your TrueHire reference in your message.</p>
        <div className="panel mt-6 p-4 sm:p-5">
          <p className="text-sm text-muted">Email</p>
          <a className="text-brand" href="mailto:hello@truehire.local">hello@truehire.local</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
