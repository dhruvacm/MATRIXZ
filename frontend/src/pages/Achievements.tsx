import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { achievementService } from "@/services/achievementService";
import { AchievementCard } from "@/components/AchievementCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { AchievementCategory } from "@/types";

const categories: (AchievementCategory | "All")[] = [
  "All",
  "Hackathons",
  "Competitions",
  "Awards",
  "Certifications",
  "Other",
];

export default function Achievements() {
  useDocumentTitle("Achievements");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const { data, loading, error, refetch } = useFetch(
    () => achievementService.list(category === "All" ? undefined : category),
    [category]
  );

  return (
    <div className="bg-[#F7F6F0] px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
            Society Milestones
          </span>
          <h1 className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-[#202923] sm:text-5xl">
            Our Achievements
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#48544B]">
            Documenting student breakthroughs, competitive hackathon placements, and honors in collegiate engineering.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-md px-4 py-1.5 font-mono text-xs font-semibold uppercase tracking-wider transition-all ${
                category === c
                  ? "border border-[#1A3E30] bg-[#214E3D] text-white shadow-subtle"
                  : "border border-[#E1E4DC] bg-white text-[#48544B] hover:border-[#8CB8A5] hover:text-[#214E3D]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <LoadingSpinner label="Loading achievements" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.length === 0 ? (
            <EmptyState
              title="Archive is currently being updated."
              description="Achievements and honors will be showcased here as awarded."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {data.map((a, i) => (
                <AchievementCard key={a._id} achievement={a} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
