import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Code2, Database, LockKeyhole, ShieldCheck, Sparkles, UsersRound, WandSparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { getApiError } from "../api/client";
import { Button } from "../components/Button";
import { Field, Input, Select } from "../components/Input";
import { useAuth } from "../context/AuthContext";
import type { Role } from "../types";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["admin", "sales"]).default("sales")
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2)
});

type AuthForm = z.infer<typeof registerSchema> & { name?: string };

export const AuthPage = ({ mode }: { mode: "login" | "register" }) => {
  const { token, login, register: registerUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AuthForm>({ resolver: zodResolver(mode === "login" ? loginSchema : registerSchema), defaultValues: { role: "sales" } });

  if (token) return <Navigate to="/" replace />;

  const onSubmit = async (values: AuthForm) => {
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await login(values.email, values.password);
      } else {
        await registerUser({ name: values.name ?? "", email: values.email, password: values.password, role: values.role as Role });
      }
      navigate("/");
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  };

  const isLogin = mode === "login";
  const inputStyles = "border-slate-800 bg-slate-950 text-slate-100 shadow-none placeholder:text-slate-600 focus:border-indigo-500 focus:ring-indigo-500/20";

  return (
    <div className="min-h-screen overflow-hidden bg-slate-900 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-950 px-5 py-4">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 p-2.5 text-white shadow-lg shadow-indigo-500/20">
              <WandSparkles size={24} />
            </div>
            <div>
              <h1 className="flex items-center gap-2 text-lg font-black tracking-tight text-white">
                Smart Leads
                <span className="rounded-full border border-indigo-500/30 bg-indigo-500/15 px-2 py-0.5 text-xs font-bold text-indigo-300">CRM Dashboard</span>
              </h1>
              <p className="text-xs font-medium text-slate-400">Secure login and signup for your sales workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-1.5 text-xs">
            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-500" />
            <span className="font-semibold text-slate-300">API Ready</span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl lg:grid-cols-[minmax(0,1fr)_460px]">
        <section className="relative flex min-h-[520px] flex-col justify-between overflow-hidden border-b border-slate-800 bg-slate-950 p-6 lg:border-b-0 lg:border-r lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:18px_18px]" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-indigo-950/50 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-bold text-indigo-300">
              <Sparkles size={14} />
              Pipeline control center
            </div>
            <h2 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-6xl">Turn every lead into a visible next step.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-400">Track prospects, protect role access, export clean CSVs, and keep your sales work organized from the first sign in.</p>
          </div>

          <div className="relative z-10 mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { icon: ShieldCheck, label: "Auth", value: "JWT Secure" },
              { icon: UsersRound, label: "Roles", value: "Admin / Sales" },
              { icon: Database, label: "Data", value: "MongoDB" }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 shadow-xl shadow-slate-950/20">
                  <Icon className="mb-4 text-indigo-300" size={22} />
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
                  <p className="mt-1 text-sm font-black text-slate-100">{item.value}</p>
                </div>
              );
            })}
          </div>

          <div className="relative z-10 mt-10 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
            <div className="flex gap-3">
              <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-300" size={18} />
              <p>Demo users are available after seeding. Use <span className="font-black">Password123</span> for admin or sales.</p>
            </div>
          </div>

          <div className="pointer-events-none absolute bottom-8 right-8 hidden h-48 w-48 rounded-full border border-indigo-500/20 bg-indigo-500/10 blur-3xl lg:block" />
        </section>

        <section className="flex items-center bg-slate-900 p-5 sm:p-8 lg:p-10">
          <form onSubmit={handleSubmit(onSubmit)} className="w-full rounded-2xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-slate-950/40">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
                  {isLogin ? <LockKeyhole size={22} /> : <ShieldCheck size={22} />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{isLogin ? "Welcome back" : "Create account"}</h2>
                  <p className="text-sm font-medium text-slate-400">{isLogin ? "Sign in to continue." : "Create your workspace login."}</p>
                </div>
              </div>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl border border-slate-800 bg-slate-900 p-1 text-sm font-bold">
              <button type="button" onClick={() => navigate("/login")} className={`rounded-lg px-3 py-2 transition ${isLogin ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-white"}`}>
                Login
              </button>
              <button type="button" onClick={() => navigate("/register")} className={`rounded-lg px-3 py-2 transition ${!isLogin ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:text-white"}`}>
                Signup
              </button>
            </div>

            <div className="grid gap-4">
              {mode === "register" ? (
                <Field label="Name" error={errors.name?.message}>
                  <Input className={inputStyles} autoComplete="name" placeholder="Your name" {...register("name")} />
                </Field>
              ) : null}
              <Field label="Email" error={errors.email?.message}>
                <Input className={inputStyles} type="email" autoComplete="email" placeholder="you@example.com" {...register("email")} />
              </Field>
              <Field label="Password" error={errors.password?.message}>
                <Input className={inputStyles} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder="At least 8 characters" {...register("password")} />
              </Field>
              {mode === "register" ? (
                <Field label="Role">
                  <Select className={inputStyles} {...register("role")}>
                    <option value="sales">Sales User</option>
                    <option value="admin">Admin</option>
                  </Select>
                </Field>
              ) : null}
              {error ? <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm font-semibold text-rose-200">{error}</div> : null}
              <Button type="submit" disabled={loading} className="mt-1 w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/15 hover:from-indigo-600 hover:to-purple-700" icon={!loading ? <ArrowRight size={18} /> : undefined}>
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Register"}
              </Button>
            </div>

            <div className="mt-5 rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs leading-5 text-slate-400">
              <div className="mb-2 flex items-center gap-2 font-bold text-slate-300">
                <Code2 size={14} />
                Demo credentials
              </div>
              <p><span className="font-bold text-slate-200">Admin:</span> admin@smartleads.dev</p>
              <p><span className="font-bold text-slate-200">Sales:</span> sales@smartleads.dev</p>
              <p><span className="font-bold text-slate-200">Password:</span> Password123</p>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};
