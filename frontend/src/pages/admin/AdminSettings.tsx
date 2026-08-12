import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth } from "@/context/AuthContext";
import { ShieldCheck, Mail, UserCircle2 } from "lucide-react";

export default function AdminSettings() {
  useDocumentTitle("Settings");
  const { admin } = useAuth();

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">Your account details for the MATRIXZ admin portal.</p>
      </div>

      <div className="mt-6 max-w-xl space-y-4">
        <div className="glass-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-glow/10 text-violet-glow">
            <UserCircle2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Name</div>
            <div className="mt-0.5 text-sm text-slate-200">{admin?.name}</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-glow/10 text-violet-glow">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Email</div>
            <div className="mt-0.5 text-sm text-slate-200">{admin?.email}</div>
          </div>
        </div>
        <div className="glass-panel flex items-center gap-4 p-5">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-glow/10 text-violet-glow">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Role</div>
            <div className="mt-0.5 text-sm capitalize text-slate-200">{admin?.role}</div>
          </div>
        </div>

        <div className="glass-panel p-5">
          <h2 className="font-display text-sm font-semibold text-white">Managing admin accounts</h2>
          <p className="mt-2 text-sm text-slate-400">
            Admin accounts are created and updated from the backend using the{" "}
            <code className="rounded bg-white/5 px-1.5 py-0.5 text-xs text-violet-glow">scripts/seedAdmin.ts</code> script,
            not from this UI, to keep credential management outside the web attack surface.
          </p>
        </div>
      </div>
    </div>
  );
}
