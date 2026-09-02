import Link from "next/link";

export function ApplyCta({ href }: { href: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-surface/95 p-3 backdrop-blur lg:hidden">
      <Link href={href} className="flex h-12 items-center justify-center rounded-md bg-brand font-medium text-white">
        Apply for this role
      </Link>
    </div>
  );
}
