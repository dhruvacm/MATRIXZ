import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { galleryService } from "@/services/galleryService";
import { GalleryGrid } from "@/components/GalleryGrid";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { GalleryCategory } from "@/types";

const categories: (GalleryCategory | "All")[] = [
  "All",
  "Events",
  "Workshops",
  "Hackathons",
  "Competitions",
  "Team",
  "Other",
];

export default function Gallery() {
  useDocumentTitle("Gallery");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const { data, loading, error, refetch } = useFetch(
    () => galleryService.list(category === "All" ? undefined : category),
    [category]
  );

  return (
    <div className="bg-white px-5 pb-24 pt-14 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <span className="eyebrow">Moments That Matter</span>
          <h1 className="mt-2.5 font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Photo Gallery
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600">
            Capturing the excitement, camaraderie, and innovation across our hackathons, workshops, and meetups.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                category === c
                  ? "bg-[#214E3D] text-white shadow-sm"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-12">
          {loading ? (
            <LoadingSpinner label="Loading gallery" />
          ) : error ? (
            <ErrorState message={error} onRetry={refetch} />
          ) : !data || data.length === 0 ? (
            <EmptyState
              title="Memories are loading..."
              description="Photos from our events will appear here."
            />
          ) : (
            <GalleryGrid images={data} />
          )}
        </div>
      </div>
    </div>
  );
}
