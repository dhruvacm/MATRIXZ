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
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="glass-card group overflow-hidden"
    >
      {/* FULL ACHIEVEMENT IMAGE */}
      <div className="relative w-full overflow-hidden bg-gradient-to-br from-violet-deep/25 to-electric/15">
        {achievement.image?.url ? (
          <img
            src={achievement.image.url}
            alt={achievement.title}
            className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center">
            <Trophy className="h-10 w-10 text-violet-glow/50" />
          </div>
        )}

        {/* CATEGORY */}
        <span className="absolute left-3 top-3 rounded-full bg-void/80 px-2.5 py-1 text-[11px] font-medium text-slate-200 backdrop-blur-md">
          {achievement.category}
        </span>
      </div>

      {/* ACHIEVEMENT INFORMATION */}
      <div className="p-5">
        <h3 className="line-clamp-1 font-display text-base font-semibold text-white">
          {achievement.title}
        </h3>

        {achievement.position && (
          <p className="mt-1 text-sm text-violet-glow">
            {achievement.position}
          </p>
        )}

        <p className="mt-2 text-xs text-slate-500">
          {formatDate(achievement.date)}
        </p>

        {achievement.description && (
          <p className="mt-2 line-clamp-2 text-sm text-slate-400">
            {achievement.description}
          </p>
        )}

        {achievement.externalLink && (
          <a
            href={achievement.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-violet-glow hover:underline"
          >
            Learn more
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </motion.div>
  );
}