import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, Trophy, Users, MessageSquare, Plus, Upload } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { dashboardService } from "@/services/dashboardService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";
import { formatDate } from "@/utils/format";
import { useEffect } from "react";
export default function AdminDashboard() {
  useDocumentTitle("Dashboard");
  const { data, loading, error, refetch } =
  useFetch(() => dashboardService.stats(), [], 5000);

useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 5000);

  return () => clearInterval(interval);
}, [refetch]);

  if (loading) return <LoadingSpinner label="Loading dashboard" />;
  if (error || !data) return <ErrorState message={error ?? "Could not load dashboard."} onRetry={refetch} />;

  const { stats, recent } = data;

  const cards = [
    { icon: CalendarDays, label: "Total Events", value: stats.totalEvents },
    { icon: Users, label: "Total Members", value: stats.totalMembers },
    { icon: Trophy, label: "Achievements", value: stats.totalAchievements },
    { icon: MessageSquare, label: "Unread Messages", value: stats.unreadMessages },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Welcome back, Admin!</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="glass-panel p-5">
            <div className="flex items-center justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-glow/10 text-violet-glow">
                <c.icon className="h-5 w-5" />
              </span>
            </div>
            <div className="mt-4 font-display text-2xl font-semibold text-white">{c.value}</div>
            <div className="text-xs text-slate-500">{c.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="glass-panel p-5">
          <div className="text-xs text-slate-500">Upcoming Events</div>
          <div className="mt-1 font-display text-xl font-semibold text-white">{stats.upcomingEvents}</div>
        </div>
        <div className="glass-panel p-5">
          <div className="text-xs text-slate-500">Past Events</div>
          <div className="mt-1 font-display text-xl font-semibold text-white">{stats.pastEvents}</div>
        </div>
        <div className="glass-panel p-5">
          <div className="text-xs text-slate-500">Gallery Images</div>
          <div className="mt-1 font-display text-xl font-semibold text-white">{stats.galleryCount}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="glass-panel p-5">
          <h2 className="font-display text-base font-semibold text-white">Recent Events</h2>
          <div className="mt-4 space-y-3">
            {recent.events.length === 0 ? (
              <p className="text-sm text-slate-500">No events yet.</p>
            ) : (
              recent.events.map((e) => (
                <div key={e._id} className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3">
                  <div>
                    <div className="text-sm text-slate-200">{e.title}</div>
                    <div className="text-xs text-slate-500">{formatDate(e.date)}</div>
                  </div>
                  <span className="rounded-full bg-violet-glow/10 px-2.5 py-1 text-[11px] text-violet-glow">{e.status}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="glass-panel p-5">
          <h2 className="font-display text-base font-semibold text-white">Recent Achievements</h2>
          <div className="mt-4 space-y-3">
            {recent.achievements.length === 0 ? (
              <p className="text-sm text-slate-500">No achievements yet.</p>
            ) : (
              recent.achievements.map((a) => (
                <div key={a._id} className="flex items-center justify-between rounded-xl border border-white/[0.06] px-4 py-3">
                  <div>
                    <div className="text-sm text-slate-200">{a.title}</div>
                    <div className="text-xs text-slate-500">{formatDate(a.date)}</div>
                  </div>
                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400">{a.category}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="font-display text-base font-semibold text-white">Quick Actions</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link to="/admin/events/upcoming" className="glass-card flex items-center gap-3 p-4 text-sm text-slate-200">
            <Plus className="h-4 w-4 text-violet-glow" /> Add Upcoming Event
          </Link>
          <Link to="/admin/achievements" className="glass-card flex items-center gap-3 p-4 text-sm text-slate-200">
            <Plus className="h-4 w-4 text-violet-glow" /> Add Achievement
          </Link>
          <Link to="/admin/teams" className="glass-card flex items-center gap-3 p-4 text-sm text-slate-200">
            <Plus className="h-4 w-4 text-violet-glow" /> Add Team Member
          </Link>
          <Link to="/admin/gallery" className="glass-card flex items-center gap-3 p-4 text-sm text-slate-200">
            <Upload className="h-4 w-4 text-violet-glow" /> Upload Gallery Image
          </Link>
        </div>
      </div>

      {recent.gallery.length > 0 && (
        <div className="mt-8">
          <h2 className="font-display text-base font-semibold text-white">Recent Gallery Uploads</h2>
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {recent.gallery.map((g) => (
              <div key={g._id} className="aspect-square overflow-hidden rounded-xl border border-white/[0.06]">
                <img src={g.image.url} alt={g.title || "MATRIXZ"} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
