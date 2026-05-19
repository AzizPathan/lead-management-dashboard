import { BarChart3, FileText, LogOut, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Button } from "./Button";
import { useAuth } from "../context/AuthContext";

export const Layout = () => {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => localStorage.getItem("smart_leads_theme") === "dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("smart_leads_theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#EBF1F5] text-slate-900 antialiased dark:bg-slate-950 dark:text-slate-100 lg:flex">
      <div className="fixed inset-x-0 top-0 z-40 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-blue-600 text-white">
            <BarChart3 size={20} />
          </div>
          <span className="text-xl font-black tracking-tight">Smart Leads</span>
        </div>
        <button className="rounded-xl bg-slate-100 p-2 text-slate-700 dark:bg-slate-900 dark:text-slate-200" onClick={() => setMobileMenuOpen((value) => !value)} aria-label="Toggle menu">
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileMenuOpen ? <button className="fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu" /> : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col justify-between border-r border-slate-100 bg-white p-6 shadow-2xl shadow-slate-900/10 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-0 lg:z-30 lg:h-screen lg:translate-x-0 lg:shadow-none ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="mb-9 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
                <BarChart3 size={22} />
                <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-orange-500" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">Smart Leads</h1>
                <p className="text-xs font-semibold text-slate-400">{user?.role === "admin" ? "Admin workspace" : "Sales workspace"}</p>
              </div>
            </div>
            <button className="text-slate-400 lg:hidden" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-2">
            <div className="rounded-2xl bg-[#091024] p-3 text-white shadow-xl shadow-slate-900/10">
              <div className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-slate-200">
                <FileText size={18} className="text-slate-400" />
                <span>Lead Pipeline</span>
              </div>
              <div className="mt-1 pl-8">
                <div className="relative py-2 text-left text-xs font-bold text-orange-500">
                  Browse Leads
                  <span className="absolute -left-4 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r bg-orange-500" />
                </div>
              </div>
            </div>
            <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </nav>
        </div>

        <div className="rounded-2xl border border-blue-50 bg-[#EBF1F5]/80 p-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 border-white bg-blue-600 text-sm font-black text-white shadow-sm">
              {user?.name?.slice(0, 1).toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <h4 className="truncate text-sm font-black text-slate-900 dark:text-white">{user?.name}</h4>
              <p className="truncate text-xs font-medium text-slate-500 dark:text-slate-400">{user?.email}</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 pt-16 lg:h-screen lg:overflow-y-auto lg:pt-0">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-100 bg-white/80 px-6 py-4 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80 lg:px-10">
          <div className="hidden items-center gap-4 lg:flex">
            <button className="text-slate-400 transition hover:text-slate-700 dark:hover:text-slate-200">
              <Menu size={20} />
            </button>
            <div>
              <p className="text-sm font-black text-slate-900 dark:text-white">Leads</p>
              <p className="text-xs font-semibold text-slate-400">Manage your pipeline</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" icon={dark ? <Sun size={18} /> : <Moon size={18} />} onClick={() => setDark((value) => !value)} aria-label="Toggle dark mode" />
          </div>
        </header>

        <Outlet />
      </main>
    </div>
  );
};
