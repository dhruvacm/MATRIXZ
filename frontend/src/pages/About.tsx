import { motion } from "framer-motion";
import { Sparkles, Target, Rocket, Users2, Code2, Lightbulb, Trophy, GitBranch } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { SectionHeading } from "@/components/SectionHeading";
import { StatsCard } from "@/components/StatsCard";
import matrixzLogo from "@/assets/matrixz-logo.png";
const pillars = [
  { icon: Lightbulb, title: "Innovation", desc: "We chase original ideas and out-of-the-box thinking in everything we build." },
  { icon: Users2, title: "Collaboration", desc: "We believe great things happen when curious minds work together." },
  { icon: Code2, title: "Learning", desc: "We learn, unlearn, and continuously grow through hands-on practice." },
  { icon: Target, title: "Impact", desc: "We create real-world impact through technology that matters." },
];

const timeline = [
  { year: "Foundation", title: "MATRIXZ is formed", desc: "A small group of students set out to build a home for builders on campus." },
  { year: "Growth", title: "Teams take shape", desc: "Web, AI/ML, Cyber Security, IoT, Design and Event Management teams come together." },
  { year: "Momentum", title: "Hackathons & workshops", desc: "Regular events, workshops, and hackathon wins start building our track record." },
  { year: "Today", title: "A growing community", desc: "MATRIXZ keeps expanding — new members, new projects, new milestones." },
];

const objectives = [
  "Provide hands-on exposure to real-world software, AI and hardware projects.",
  "Organize hackathons, workshops and tech talks that sharpen practical skills.",
  "Build a peer community where students mentor and learn from each other.",
  "Represent the department at inter-college hackathons and competitions.",
];

export default function About() {
  useDocumentTitle("About");

  return (
    <div>
      <section className="relative grid-bg overflow-hidden px-5 pb-20 pt-14 lg:px-8">
        <div className="pointer-events-none absolute -top-24 left-1/3 h-[360px] w-[360px] rounded-full bg-violet-glow/15 blur-[110px]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">About / MATRIXZ</span>
            <h1
  className="text-5xl font-semibold tracking-wide text-white sm:text-6xl"
  style={{ fontFamily: "var(--font-premium)" }}
>
  About MATRIXZ
</h1>
            <p className="mt-5 max-w-xl leading-relaxed text-slate-400">
              MATRIXZ is more than just a club. It's a movement of passionate learners, innovators and creators who
              believe in turning ideas into impact.
            </p>
            <ul className="mt-6 space-y-3">
              {["Skill Development", "Project Building", "Industry Exposure", "Real World Impact"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-violet-glow/15 text-violet-glow">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
  initial={{ opacity: 0, scale: 0.92 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.7, delay: 0.1 }}
  className="relative mx-auto flex h-[300px] w-[300px] items-center justify-center sm:h-[420px] sm:w-[520px]"
>
  {/* Soft purple glow behind the logo */}
  <div className="absolute h-64 w-64 rounded-full bg-violet-glow/20 blur-[90px]" />

  {/* Futuristic orbit rings */}
  <div className="absolute h-[300px] w-[300px] rounded-full border border-violet-glow/20 animate-pulse-slow" />
  <div className="absolute h-[240px] w-[240px] rounded-full border border-electric/15" />

  {/* Logo */}
  <motion.img
    src={matrixzLogo}
    alt="MATRIXZ Logo"
    animate={{
      y: [0, -8, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="
      relative
      z-10
      w-[280px]
      max-w-[90%]
      object-contain
      drop-shadow-[0_0_25px_rgba(139,92,246,0.35)]
      sm:w-[430px]
    "
  />
</motion.div>
        </div>

        
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
  <span className="eyebrow">Who We Are</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    What drives MATRIXZ
  </h1>
</div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass-card p-6"
              >
                <p.icon className="h-6 w-6 text-violet-glow" />
                <h3 className="mt-4 font-display text-lg font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
  <span className="eyebrow">Vision & Mission</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Why MATRIXZ exists
  </h1>
</div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            <div className="glass-panel p-6">
              <h3 className="font-display text-lg font-semibold text-white">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                To be the launchpad where every student in our department discovers what they can build, and builds
                the confidence to ship it.
              </p>
            </div>
            <div className="glass-panel p-6">
              <h3 className="font-display text-lg font-semibold text-white">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                To create hands-on opportunities — projects, hackathons, workshops and mentorship — that turn
                classroom concepts into real technical skill.
              </p>
            </div>
          </div>

          <div className="mt-6 glass-panel p-6">
            <h3 className="font-display text-lg font-semibold text-white">Objectives</h3>
            <ul className="mt-4 space-y-3">
              {objectives.map((o) => (
                <li key={o} className="flex items-start gap-3 text-sm text-slate-400">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-glow" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
         <div className="text-center">
  <span className="eyebrow">Club Journey</span>

  <h1
    className="mt-2 text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    How we got here
  </h1>
</div>
          <div className="mt-12 space-y-6 border-l border-white/[0.08] pl-8">
            {timeline.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative"
              >
                <span className="absolute -left-[2.35rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-violet-glow shadow-glow-sm">
                  <GitBranch className="h-2.5 w-2.5 text-void" />
                </span>
                <span className="eyebrow">{t.year}</span>
                <h3 className="mt-1 font-display text-lg font-semibold text-white">{t.title}</h3>
                <p className="mt-1 text-sm text-slate-400">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
