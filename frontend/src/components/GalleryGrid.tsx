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
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {images.map((img, i) => (
          <motion.button
            key={img._id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.35, delay: (i % 8) * 0.04 }}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06]"
          >
            <img src={img.image.url} alt={img.title || "MATRIXZ gallery"} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {img.title && (
              <span className="absolute bottom-2 left-2 right-2 truncate text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
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
            className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 p-4"
            onClick={close}
          >
            <button aria-label="Close preview" onClick={close} className="absolute right-5 top-5 text-slate-300 hover:text-white">
              <X className="h-7 w-7" />
            </button>
            <button aria-label="Previous image" onClick={prev} className="absolute left-3 sm:left-6 text-slate-300 hover:text-white">
              <ChevronLeft className="h-9 w-9" />
            </button>
            <motion.img
              key={images[activeIndex]._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              src={images[activeIndex].image.url}
              alt={images[activeIndex].title || "MATRIXZ gallery"}
              className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button aria-label="Next image" onClick={next} className="absolute right-3 sm:right-6 text-slate-300 hover:text-white">
              <ChevronRight className="h-9 w-9" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
