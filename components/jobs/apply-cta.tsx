import Link from "next/link";

export function ApplyCta({ href }: { href: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/96 px-3 pt-2.5 backdrop-blur lg:hidden" style={{ paddingBottom: "max(0.65rem, env(safe-area-inset-bottom))" }}>
      <Link href={href} className="flex h-11 items-center justify-center rounded-md bg-brand text-sm font-medium text-white">
        Apply for this role
      </Link>
    </div>
  );
}
