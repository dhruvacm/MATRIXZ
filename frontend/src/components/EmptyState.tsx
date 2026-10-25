import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[#E1E4DC] bg-[#FAF9F5] px-8 py-14 text-center"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-md border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D] shadow-subtle">
        {icon ?? <Sparkles className="h-5 w-5" />}
      </div>
      <h3 className="font-display text-base font-bold text-[#202923]">{title}</h3>
      <p className="max-w-sm text-sm leading-relaxed text-[#6E7A71]">{description}</p>
    </motion.div>
  );
}
