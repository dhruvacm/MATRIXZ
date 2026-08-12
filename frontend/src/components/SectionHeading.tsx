import { motion } from "framer-motion";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-3 font-display text-4xl font-semibold uppercase tracking-[.02em] text-white sm:text-5xl">{title}</h2>
      {description && <p className="mt-4 text-slate-400 leading-relaxed">{description}</p>}
    </motion.div>
  );
}
