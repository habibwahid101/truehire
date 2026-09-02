import { SiteFooter, SiteHeader } from "@/components/site-header";
export const metadata = { title: "Terms" };
export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-12 sm:py-16">
        <p className="kicker">Policy</p>
        <h1 className="serif mt-3 text-4xl">Terms</h1>
        <div className="prose-job mt-6 text-muted">
          <p>TrueHire publishes roles and collects applications on behalf of participating employers. Listing a role does not guarantee that every applicant will be contacted.</p>
          <p>Candidates are responsible for the accuracy of the information they submit. Applications may be declined where information is incomplete or inconsistent with the stated requirements.</p>
          <p>Each role may include additional terms and conditions. Those terms apply in addition to these platform terms.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
