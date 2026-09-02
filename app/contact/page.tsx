import { SiteFooter, SiteHeader } from "@/components/site-header";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-12 sm:py-16">
        <p className="kicker">Help</p>
        <h1 className="serif mt-3 text-4xl">Contact</h1>
        <p className="mt-4 text-muted">For questions about an application, include your TrueHire reference in your message.</p>
        <div className="panel mt-8 p-5">
          <p className="text-sm text-muted">Email</p>
          <a className="text-brand" href="mailto:hello@truehire.local">hello@truehire.local</a>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
