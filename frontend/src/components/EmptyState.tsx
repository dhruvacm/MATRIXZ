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
      className="glass-panel flex flex-col items-center justify-center gap-3 px-8 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-glow/10 text-violet-glow">
        {icon ?? <Sparkles className="h-5 w-5" />}
      </div>
      <h3 className="text-lg font-medium text-slate-100">{title}</h3>
      <p className="max-w-sm text-sm text-slate-400">{description}</p>
    </motion.div>
  );
}
