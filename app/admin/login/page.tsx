import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/session";
import { isReviewUi } from "@/lib/review";
import { LoginForm } from "./login-form";

export const metadata = { title: "Admin sign in" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  if (await getAdminSession()) redirect("/admin");
  if (isReviewUi()) redirect("/admin");
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md border border-line bg-surface p-7 sm:p-8">
        <p className="serif text-2xl text-brand">TrueHire</p>
        <h1 className="mt-3 text-xl font-medium">Administrator sign in</h1>
        <p className="mt-2 text-sm text-muted">Access is limited to authorised recruitment staff.</p>
        <LoginForm next={params.next || "/admin"} />
        <p className="mt-6 text-xs text-faint"><Link href="/">Back to TrueHire</Link></p>
      </div>
    </main>
  );
}
