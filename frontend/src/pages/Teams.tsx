import { useMemo, useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { teamService } from "@/services/teamService";
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
    return members.filter((m) =>
      typeof m.team === "string" ? m.team === activeTeam : m.team._id === activeTeam
    );
  }, [members, activeTeam]);

  return (
    <div className="bg-[#F7F6F0] px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
            Department Divisions
          </span>
          <h1 className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-[#202923] sm:text-5xl">
            Meet the People Behind MATRIXZ
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#48544B]">
            Undergraduate researchers, systems developers, and organizers collaborating to drive technological excellence.
          </p>
        </div>

        {teams && teams.length > 0 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setActiveTeam("all")}
              className={`rounded-md px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                activeTeam === "all"
                  ? "border border-[#1A3E30] bg-[#214E3D] text-white shadow-subtle"
                  : "border border-[#E1E4DC] bg-white text-[#48544B] hover:border-[#8CB8A5] hover:text-[#214E3D]"
              }`}
            >
              All Teams
            </button>
            {teams.map((t) => (
              <button
                key={t._id}
                onClick={() => setActiveTeam(t._id)}
                className={`rounded-md px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeTeam === t._id
                    ? "border border-[#1A3E30] bg-[#214E3D] text-white shadow-subtle"
                    : "border border-[#E1E4DC] bg-white text-[#48544B] hover:border-[#8CB8A5] hover:text-[#214E3D]"
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
            <EmptyState
              title="No team members indexed yet."
              description="Team member profiles will show up here once configured."
            />
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
