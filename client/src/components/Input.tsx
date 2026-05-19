import clsx from "clsx";
import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes } from "react";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={clsx(
      "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-brand focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-950",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={clsx(
      "h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-sm outline-none transition focus:border-brand focus:ring-4 focus:ring-teal-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-teal-950",
      className
    )}
    {...props}
  />
));

Select.displayName = "Select";

export const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="grid gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
    {label}
    {children}
    {error ? <span className="text-xs font-semibold text-rose-600 dark:text-rose-300">{error}</span> : null}
  </label>
);
