import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { fixtureAdmin } from "@/lib/fixtures";
import { isReviewUi } from "@/lib/review";
import { getAdminSession } from "@/lib/session";

export default async function ConsoleLayout({ children }: { children: React.ReactNode }) {
  const session = (await getAdminSession()) || (isReviewUi() ? fixtureAdmin : null);
  if (!session) redirect("/admin/login");
  return <AdminShell session={session}>{children}</AdminShell>;
}
