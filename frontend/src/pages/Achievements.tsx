import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { achievementService } from "@/services/achievementService";
import { SectionHeading } from "@/components/SectionHeading";
import { AchievementCard } from "@/components/AchievementCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { AchievementCategory } from "@/types";

const categories: (AchievementCategory | "All")[] = ["All", "Hackathons", "Competitions", "Awards", "Certifications", "Other"];

export default function Achievements() {
  useDocumentTitle("Achievements");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const { data, loading, error, refetch } = useFetch(() => achievementService.list(category === "All" ? undefined : category), [category]);

  return (
    <div className="px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
  <span className="eyebrow">Milestones</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Our Achievements
  </h1>
</div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                category === c ? "bg-violet-glow text-white shadow-glow-sm" : "border border-white/10 text-slate-400 hover:text-slate-100"
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
            <EmptyState title="Our journey is just getting started." description="Achievements and milestones will be showcased here." />
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
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
