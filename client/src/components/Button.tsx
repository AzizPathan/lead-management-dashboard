import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  icon?: ReactNode;
}

export const Button = ({ className, variant = "primary", icon, children, ...props }: ButtonProps) => {
  const styles = {
    primary: "bg-brand text-white shadow-sm shadow-teal-900/20 hover:bg-teal-800",
    secondary: "border border-slate-200 bg-white text-slate-800 shadow-sm hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800",
    danger: "bg-rose-600 text-white shadow-sm shadow-rose-900/20 hover:bg-rose-700",
    ghost: "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
  };

  return (
    <button
      className={clsx(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        styles[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
};
