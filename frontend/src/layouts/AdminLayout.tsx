import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, CalendarDays, Users, Trophy, Images, MessageSquare, Settings, LogOut, Menu, X, ChevronDown,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  {
    label: "Events",
    icon: CalendarDays,
    children: [
      { to: "/admin/events/upcoming", label: "Upcoming Events" },
      { to: "/admin/events/past", label: "Past Events" },
    ],
  },
  { to: "/admin/teams", label: "Teams", icon: Users },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy },
  { to: "/admin/gallery", label: "Gallery", icon: Images },
  { to: "/admin/messages", label: "Contact Messages", icon: MessageSquare },
];

export function AdminLayout() {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [eventsOpen, setEventsOpen] = useState(true);

  function handleLogout() {
    logout();
    navigate("/admin/login");
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-6 py-6">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
          <path d="M6 24V8l10 9 10-9v16" stroke="#8b5cf6" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div>
          <div className="font-display text-base font-semibold text-white leading-none">MATRIXZ</div>
          <div className="text-[10px] uppercase tracking-widest text-violet-glow/80">Admin</div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map((item) =>
          item.children ? (
            <div key={item.label}>
              <button
                onClick={() => setEventsOpen((v) => !v)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-100"
              >
                <span className="flex items-center gap-3"><item.icon className="h-4 w-4" /> {item.label}</span>
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${eventsOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {eventsOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden pl-9">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) =>
                          `block rounded-lg py-2 pl-2 text-sm transition-colors ${isActive ? "text-violet-glow" : "text-slate-500 hover:text-slate-200"}`
                        }
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink
              key={item.to}
              to={item.to!}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  isActive ? "bg-violet-glow/10 text-violet-glow" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                }`
              }
            >
              <item.icon className="h-4 w-4" /> {item.label}
            </NavLink>
          )
        )}
        <NavLink
          to="/admin/settings"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
              isActive ? "bg-violet-glow/10 text-violet-glow" : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
            }`
          }
        >
          <Settings className="h-4 w-4" /> Settings
        </NavLink>
      </nav>

      <div className="border-t border-white/[0.06] p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-glow/15 text-sm font-semibold text-violet-glow">
            {admin?.name?.charAt(0) ?? "A"}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm text-slate-200">{admin?.name ?? "Admin"}</div>
            <div className="truncate text-xs text-slate-500">{admin?.role === "superadmin" ? "Super Admin" : "Admin"}</div>
          </div>
        </div>
        <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-400 hover:bg-rose-500/10 hover:text-rose-400">
          <LogOut className="h-4 w-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-void">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-white/[0.06] bg-void-soft/80 backdrop-blur-xl lg:block">
        {sidebarContent}
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/70 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-void-soft lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/[0.06] bg-void/80 px-5 py-4 backdrop-blur-xl lg:hidden">
          <span className="font-display text-base font-semibold text-white">MATRIXZ Admin</span>
          <button onClick={() => setMobileOpen(true)} aria-label="Open menu" className="text-slate-200">
            <Menu className="h-6 w-6" />
          </button>
        </header>
        <main className="p-5 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
