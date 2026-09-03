import { cn } from "@/lib/utils";
import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export function Field({
  label, hint, error, htmlFor, children,
}: { label: string; hint?: string; error?: string; htmlFor?: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1" htmlFor={htmlFor}>
      <span className="block text-[13.5px] font-medium text-ink">{label}</span>
      {children}
      {hint && !error ? <span className="block text-[13px] text-muted">{hint}</span> : null}
      {error ? <span className="block text-[13px] text-danger" role="alert">{error}</span> : null}
    </label>
  );
}

const control = "w-full min-h-11 rounded-md border border-line bg-surface px-3 py-2 text-[15px] text-ink placeholder:text-faint focus:border-brand";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...props} />;
}
export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(control, "min-h-24 resize-y", className)} {...props} />;
}
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(control, className)} {...props} />;
}
export function Checkbox({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="flex items-start gap-3 text-sm leading-6 text-ink">
      <input type="checkbox" className="mt-1 size-4 accent-brand" {...props} />
      <span>
        {label}
        {error ? <span className="mt-1 block text-danger" role="alert">{error}</span> : null}
      </span>
    </label>
  );
}
