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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.4 }}
      className={align === "center" ? "text-center mx-auto max-w-2xl" : ""}
    >
      <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
        {eyebrow}
      </span>
      <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-[#48544B]">
          {description}
        </p>
      )}
    </motion.div>
  );
}
