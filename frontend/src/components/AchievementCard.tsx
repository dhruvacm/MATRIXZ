import { motion } from "framer-motion";
import { Trophy, ExternalLink } from "lucide-react";
import { Achievement } from "@/types";
import { formatDate } from "@/utils/format";

export function AchievementCard({
  achievement,
  index = 0,
}: {
  achievement: Achievement;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#E1E4DC] bg-white shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card"
    >
      {/* ACHIEVEMENT IMAGE */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#FAF9F5]">
        {achievement.image?.url ? (
          <img
            src={achievement.image.url}
            alt={achievement.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[#EDF3EE]">
            <Trophy className="h-9 w-9 text-[#8CB8A5]" />
          </div>
        )}

        {/* CATEGORY BADGE */}
        <span className="absolute left-3 top-3 rounded border border-[#CAD9CC] bg-[#DCE8DE]/95 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#214E3D] shadow-subtle backdrop-blur-sm">
          {achievement.category}
        </span>
      </div>

      {/* ACHIEVEMENT INFORMATION */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-1 font-display text-base font-bold text-[#202923] transition-colors group-hover:text-[#214E3D]">
          {achievement.title}
        </h3>

        {achievement.position && (
          <p className="mt-1 font-mono text-xs font-semibold text-[#214E3D]">
            {achievement.position}
          </p>
        )}

        <p className="mt-1 font-mono text-[11px] text-[#6E7A71]">
          {formatDate(achievement.date)}
        </p>

        {achievement.description && (
          <p className="mt-2.5 line-clamp-2 flex-1 text-xs leading-relaxed text-[#48544B]">
            {achievement.description}
          </p>
        )}

        {achievement.externalLink && (
          <a
            href={achievement.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 font-mono text-xs font-semibold text-[#214E3D] hover:text-[#1A3E30] hover:underline"
          >
            Learn more
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}