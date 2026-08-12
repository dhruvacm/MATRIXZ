import { useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { teamService } from "@/services/teamService";
import { SectionHeading } from "@/components/SectionHeading";
import { TeamCard } from "@/components/TeamCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

export default function Teams() {
  useDocumentTitle("Teams");
  const { data: teams } = useFetch(() => teamService.listTeams());
  const { data: members, loading, error, refetch } = useFetch(() => teamService.listMembers());
  const [activeTeam, setActiveTeam] = useState<string>("all");

  const filtered = useMemo(() => {
    if (!members) return [];
    if (activeTeam === "all") return members;
    return members.filter((m) => (typeof m.team === "string" ? m.team === activeTeam : m.team._id === activeTeam));
  }, [members, activeTeam]);

  return (
    <div className="px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
  <span className="eyebrow">Our Teams</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Meet the people behind MATRIXZ
  </h1>
</div>

        {teams && teams.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTeam("all")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                activeTeam === "all" ? "bg-violet-glow text-white shadow-glow-sm" : "border border-white/10 text-slate-400 hover:text-slate-100"
              }`}
            >
              All Teams
            </button>
            {teams.map((t) => (
              <button
                key={t._id}
                onClick={() => setActiveTeam(t._id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  activeTeam === t._id ? "bg-violet-glow text-white shadow-glow-sm" : "border border-white/10 text-slate-400 hover:text-slate-100"
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12">
          {loading ? (
            <LoadingSpinner label="Loading teams" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : filtered.length === 0 ? (
            <EmptyState title="No team members yet." description="Team profiles will show up here once they're added." />
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((m, i) => (
                <TeamCard key={m._id} member={m} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
