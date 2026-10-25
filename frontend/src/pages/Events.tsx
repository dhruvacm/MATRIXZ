import { useState } from "react";
import { motion } from "framer-motion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { eventService } from "@/services/eventService";
import { EventCard } from "@/components/EventCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

export default function Events() {
  useDocumentTitle("Events");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { data, loading, error, refetch } = useFetch(() => eventService.list(tab), [tab]);

  return (
    <div className="bg-[#F7F6F0] px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
            Society Calendar
          </span>
          <h1 className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-[#202923] sm:text-5xl">
            Events & Workshops
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-[#48544B]">
            From systems bootcamps to competitive 24-hour hackathons, explore upcoming technical sessions and past records.
          </p>
        </div>

        <div className="relative mx-auto mt-10 flex w-fit gap-1 rounded-md border border-[#E1E4DC] bg-white p-1 shadow-subtle">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative rounded px-5 py-1.5 font-mono text-xs font-semibold capitalize transition-colors ${
                tab === t ? "text-white" : "text-[#48544B] hover:text-[#214E3D]"
              }`}
            >
              {tab === t && (
                <motion.span
                  layoutId="events-tab"
                  className="absolute inset-0 rounded bg-[#214E3D] shadow-sm"
                  transition={{ type: "spring", stiffness: 350, damping: 28 }}
                />
              )}
              <span className="relative z-10">{t} Events</span>
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <LoadingSpinner label="Loading events" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.length === 0 ? (
            <EmptyState
              title={tab === "upcoming" ? "No upcoming events scheduled." : "No past events to show."}
              description={
                tab === "upcoming"
                  ? "Stay tuned — seminar schedules and competition timelines will be published shortly."
                  : "Archived event summaries will be documented here as completed."
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((e, i) => (
                <EventCard key={e._id} event={e} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
