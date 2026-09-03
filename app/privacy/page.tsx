import { SiteFooter, SiteHeader } from "@/components/site-header";
export const metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="container-narrow py-8 sm:py-12">
        <p className="kicker">Policy</p>
        <h1 className="serif page-title mt-2">Privacy</h1>
        <div className="prose-job mt-5 text-sm leading-6 text-muted sm:text-[15.5px]">
          <p>TrueHire collects personal information that candidates submit when applying for a role. This typically includes contact details, education and career history, answers to screening questions, and uploaded documents such as a CV.</p>
          <p>Submitted information is used for recruitment related to the role applied for and for operating the recruitment process. Documents are stored privately and are not published on public pages.</p>
          <p>Access to candidate information is limited to authorised TrueHire administrators. We do not sell candidate data.</p>
          <p>If you need a correction or a copy of information you submitted, use the contact page and include your application reference.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
