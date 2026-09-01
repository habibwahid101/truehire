import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
};

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" && "h-9 px-3 text-sm",
        size === "md" && "h-11 px-4 text-[15px]",
        size === "lg" && "h-12 px-5 text-base",
        variant === "primary" && "bg-brand text-white hover:bg-brand-hover",
        variant === "secondary" && "border border-line bg-surface text-ink hover:bg-brand-soft",
        variant === "ghost" && "text-ink hover:bg-brand-soft",
        variant === "danger" && "bg-danger text-white hover:opacity-90",
        variant === "soft" && "bg-brand-soft text-brand",
        className,
      )}
      {...props}
    />
  );
}
