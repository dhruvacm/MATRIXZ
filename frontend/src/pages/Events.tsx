import { useState } from "react";
import { motion } from "framer-motion";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { eventService } from "@/services/eventService";
import { SectionHeading } from "@/components/SectionHeading";
import { EventCard } from "@/components/EventCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";

export default function Events() {
  useDocumentTitle("Events");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const { data, loading, error, refetch } = useFetch(() => eventService.list(tab), [tab]);

  return (
    <div className="px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
  <span className="eyebrow">What's Happening</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Events
  </h1>
</div>

        <div className="relative mx-auto mt-10 flex w-fit gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`relative rounded-full px-6 py-2.5 text-sm font-medium capitalize transition-colors ${
                tab === t ? "text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === t && (
                <motion.span layoutId="events-tab" className="absolute inset-0 rounded-full bg-violet-glow shadow-glow-sm" transition={{ type: "spring", stiffness: 350, damping: 28 }} />
              )}
              <span className="relative">{t} Events</span>
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
              title={tab === "upcoming" ? "No upcoming events yet." : "No past events to show."}
              description={tab === "upcoming" ? "Stay tuned — something exciting is coming." : "Our event history will appear here as we host more."}
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
