import { ReactNode } from "react";
import { motion } from "framer-motion";

export function GlassCard({
  children,
  className = "",
  hover = true,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4, delay }}
      className={`rounded-lg border border-[#E1E4DC] bg-white p-6 shadow-subtle transition-all duration-200 ${
        hover ? "hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card" : ""
      } ${className}`}
    >
      {children}
    </motion.div>
  );
}
