import { motion } from "framer-motion";
import { Sparkles, Target, Rocket, Users2, Code2, Lightbulb, Trophy, GitBranch } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
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
    <div className="bg-[#F7F6F0]">
      {/* HERO SECTION */}
      <section className="relative border-b border-[#E1E4DC] bg-[#F7F6F0] px-5 pb-20 pt-14 lg:px-8">
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              Society Overview
            </span>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-[#202923] sm:text-5xl">
              About MATRIXZ
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#48544B] sm:text-lg">
              MATRIXZ is more than just a club. It is an intentional forum of student researchers, developers, and designers
              dedicated to technological excellence and peer mentorship.
            </p>
            <ul className="mt-6 space-y-3">
              {["Systems & Web Engineering", "Algorithmic Problem Solving", "Applied Research & Prototyping", "Peer Mentorship & Symposia"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium text-[#202923]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                    <Sparkles className="h-3 w-3" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative mx-auto flex h-[280px] w-[280px] items-center justify-center rounded-xl border border-[#E1E4DC] bg-white p-8 shadow-subtle sm:h-[340px] sm:w-[420px]"
          >
            <div className="absolute inset-4 rounded-lg border border-dashed border-[#DCE8DE]" />
            <img
              src={matrixzLogo}
              alt="MATRIXZ Logo"
              className="relative z-10 max-h-48 w-auto object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="border-b border-[#E1E4DC] bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              Guiding Principles
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
              What Drives MATRIXZ
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-lg border border-[#E1E4DC] bg-[#FAF9F5] p-6 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:bg-white hover:shadow-card"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-[#202923]">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#48544B]">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="border-b border-[#E1E4DC] bg-[#EDF3EE] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <span className="inline-block rounded border border-[#CAD9CC] bg-[#DCE8DE] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              Institutional Purpose
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
              Why MATRIXZ Exists
            </h2>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-lg border border-[#E1E4DC] bg-white p-6 shadow-subtle">
              <h3 className="font-display text-lg font-bold text-[#202923]">Our Vision</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#48544B]">
                To serve as the launching pad where every computer science student discovers their capability to architect,
                ship, and defend complex software systems.
              </p>
            </div>
            <div className="rounded-lg border border-[#E1E4DC] bg-white p-6 shadow-subtle">
              <h3 className="font-display text-lg font-bold text-[#202923]">Our Mission</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#48544B]">
                To cultivate hands-on technical literacy through open hackathons, peer code reviews, research paper discussions,
                and competitive engineering challenges.
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-lg border border-[#E1E4DC] bg-white p-6 shadow-subtle">
            <h3 className="font-display text-base font-bold text-[#202923]">Strategic Objectives</h3>
            <ul className="mt-4 space-y-3">
              {objectives.map((o) => (
                <li key={o} className="flex items-start gap-3 text-sm text-[#48544B]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#214E3D]" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-[#F7F6F0] px-5 py-20 pb-24 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              Historical Milestones
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
              Our Journey
            </h2>
          </div>
          <div className="mt-12 space-y-8 border-l-2 border-[#DCE8DE] pl-8">
            {timeline.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="relative"
              >
                <span className="absolute -left-[2.55rem] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#214E3D] text-white shadow-subtle ring-4 ring-[#F7F6F0]">
                  <GitBranch className="h-3 w-3" />
                </span>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">{t.year}</span>
                <h3 className="mt-1 font-display text-base font-bold text-[#202923]">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[#48544B]">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
