import { SiteFooter, SiteHeader } from "@/components/site-header";
export const metadata = { title: "Contact" };
export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-14">
        <h1 className="serif text-4xl">Contact</h1>
        <p className="mt-4 text-muted">For questions about an application, include your TrueHire reference in your message.</p>
        <p className="mt-6"><a className="text-brand underline" href="mailto:hello@truehire.local">hello@truehire.local</a></p>
      </main>
      <SiteFooter />
    </>
  );
}
