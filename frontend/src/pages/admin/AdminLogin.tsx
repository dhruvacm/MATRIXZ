import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Lock, Mail, Eye, EyeOff } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth } from "@/context/AuthContext";

const schema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});
type FormData = z.infer<typeof schema>;

export default function AdminLogin() {
  useDocumentTitle("Admin Login");
  const { admin, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (admin) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin/dashboard";
    return <Navigate to={from} replace />;
  }

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await login(data.email, data.password);
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed. Please try again.");
    }
  }

  return (
    <div className="grid-bg flex min-h-screen items-center justify-center px-5">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-violet-glow/15 blur-[130px]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <svg width="40" height="40" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#8b5cf6" fillOpacity="0.15" />
            <path d="M6 24V8l10 9 10-9v16" stroke="#8b5cf6" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">MATRIXZ Admin</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to manage the club platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-panel space-y-4 p-7" noValidate>
          {serverError && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{serverError}</div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-400">Email</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-violet-glow/50 focus:outline-none"
                placeholder="admin@matrixz.club"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-slate-400">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                {...register("password")}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-10 text-sm text-white placeholder:text-slate-600 focus:border-violet-glow/50 focus:outline-none"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
