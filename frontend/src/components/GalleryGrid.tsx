import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { GalleryImage } from "@/types";

export function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  function close() {
    setActiveIndex(null);
  }
  function next(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  }
  function prev(e?: React.MouseEvent) {
    e?.stopPropagation();
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          <motion.button
            key={img._id}
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: (i % 8) * 0.03 }}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-md border border-[#E1E4DC] bg-[#FAF9F5] shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card"
          >
            <img
              src={img.image.url}
              alt={img.title || "MATRIXZ gallery"}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#202923]/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {img.title && (
              <span className="absolute bottom-2.5 left-2.5 right-2.5 truncate text-left font-mono text-[11px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {img.title}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[95] flex items-center justify-center bg-[#202923]/90 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              aria-label="Close preview"
              onClick={close}
              className="absolute right-5 top-5 rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              aria-label="Previous image"
              onClick={prev}
              className="absolute left-3 sm:left-6 rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <motion.img
              key={images[activeIndex]._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[activeIndex].image.url}
              alt={images[activeIndex].title || "MATRIXZ gallery"}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              aria-label="Next image"
              onClick={next}
              className="absolute right-3 sm:right-6 rounded-md bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
