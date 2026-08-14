import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,

  Linkedin,
  Instagram,
  Mail,
  Code2,
  Users2,
  Lightbulb,
  BookOpen,
  Target,
  CalendarDays,
  Trophy,
} from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { eventService } from "@/services/eventService";
import { teamService } from "@/services/teamService";
import { achievementService } from "@/services/achievementService";
import { galleryService } from "@/services/galleryService";
import { SectionHeading } from "@/components/SectionHeading";
import { EventCard } from "@/components/EventCard";
import { TeamCard } from "@/components/TeamCard";
import { AchievementCard } from "@/components/AchievementCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ContactForm } from "@/components/ContactForm";
import matrixzLogo from "@/assets/matrixz-logo.png";
const MatrixHero = lazy(() => import("@/components/MatrixHero").then((m) => ({ default: m.MatrixHero })));

const domains = [
  { icon: Lightbulb, title: "Innovation", desc: "We encourage new ideas and out-of-the-box thinking." },
  { icon: Users2, title: "Collaboration", desc: "We believe great things are built together." },
  { icon: BookOpen, title: "Learning", desc: "We learn, unlearn, and continuously grow." },
  { icon: Target, title: "Impact", desc: "We create real world impact through technology." },
];

export default function Home() {
  useDocumentTitle("Home");

  const { data: upcomingEvents, loading: eventsLoading } = useFetch(() => eventService.list("upcoming"));
  const { data: members, loading: membersLoading } = useFetch(() => teamService.listMembers());
  const { data: achievements, loading: achLoading } = useFetch(() => achievementService.list());
  const { data: galleryImages, loading: galLoading } = useFetch(() => galleryService.list());
  const { data: teams, loading: teamsLoading } = useFetch(() => teamService.listTeams());
  const { data:pastEvents, loading: pastEventsLoading } = useFetch(() => eventService.list("past"));
  const topEvents = upcomingEvents?.slice(0, 3) ?? [];
  const topMembers = members?.slice(0, 13) ?? [];
  const topAchievements = achievements?.slice(0, 4) ?? [];
  const topGallery = galleryImages?.slice(0, 5) ?? [];

  return (
    <div>
      {/* HERO */}
      <section className="relative grid-bg overflow-hidden px-5 pb-20 pt-14 lg:min-h-[650px] lg:px-8 lg:pb-24">
        <div className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-violet-glow/[.13] blur-[130px]" />
        <div className="pointer-events-none absolute -bottom-24 left-0 h-[360px] w-[360px] rounded-full bg-electric/[.08] blur-[120px]" />

       {/* Vertical social rail */}
<div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-4 lg:flex">

  {/* Instagram */}
  <a
    href="https://www.instagram.com/matrixz_cse_pesce"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Instagram"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 backdrop-blur-md transition-colors hover:border-violet-glow/50 hover:text-violet-glow"
  >
    <Instagram className="h-4 w-4" />
  </a>

  {/* LinkedIn */}
  <a
    href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="LinkedIn"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 backdrop-blur-md transition-colors hover:border-violet-glow/50 hover:text-violet-glow"
  >
    <Linkedin className="h-4 w-4" />
  </a>

  {/* Email */}
  <a
    href="mailto:matrixzpesce@gmail.com"
    aria-label="Email"
    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-slate-400 backdrop-blur-md transition-colors hover:border-violet-glow/50 hover:text-violet-glow"
  >
    <Mail className="h-4 w-4" />
  </a>

</div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.95fr_1.05fr] lg:gap-3 lg:pr-14">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="eyebrow">Innovate • Collaborate • Elevate</span>
            <h1 className="mt-4 font-display text-6xl font-bold uppercase leading-[.9] tracking-[.035em] text-white sm:text-8xl">
              MATRIXZ
            </h1>
            <p className="mt-3 font-display text-2xl font-bold uppercase tracking-[.04em] text-gradient sm:text-3xl">
              Compile. Save. Execute.
            </p>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-slate-400 sm:text-[13px]">
              The official technical club of our department, fostering innovation, creativity, and technical excellence.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/about" className="btn-primary">
                Explore MATRIXZ <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/events" className="btn-secondary">
                Upcoming Events
              </Link>
            </div>

            <div className="matrix-stats-grid mt-10">
  {[
    {
  icon: Users2,
  value: `${members?.length ?? 0}+`,
  label: "Members",
},
{
  icon: CalendarDays,
  value: `${pastEvents?.length ?? 0}+`,
  label: "Events",
},
{
  icon: Trophy,
  value: `${achievements?.length ?? 0}+`,
  label: "Achievements",
},
{
  icon: Code2,
  value: `${teams?.length ?? 0}+`,
  label: "Teams",
}
  ].map((s, index) => (
    <div
      key={s.label}
      className="matrix-future-card"
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      <span className="matrix-corner top-left" />
      <span className="matrix-corner top-right" />
      <span className="matrix-corner bottom-left" />
      <span className="matrix-corner bottom-right" />

      <span className="matrix-card-scan" />

      <div className="matrix-card-status">
        <span />
        ACTIVE
      </div>

      <div className="matrix-future-icon">
        <s.icon className="h-5 w-5" />
      </div>

      <div className="matrix-future-value">
        {s.value}
      </div>

      <div className="matrix-future-label">
        {s.label}
      </div>

      <div className="matrix-card-line">
        <span />
      </div>
    </div>
  ))}
</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto h-[330px] w-full max-w-[390px] sm:h-[470px] sm:max-w-[470px]"
          >
            <Suspense
              fallback={
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-24 w-24 animate-pulse rounded-2xl border border-violet-glow/30 bg-violet-glow/10" />
                </div>
              }
            >
              <MatrixHero className="h-full w-full" />
            </Suspense>
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-t border-white/[.055] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          <motion.div
  initial={{ opacity: 0, x: -24 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.7 }}
  className="relative mx-auto flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80"
>
  {/* Main purple glow */}
  <div className="absolute h-56 w-56 rounded-full bg-violet-glow/20 blur-[80px]" />

  {/* Outer orbit */}
  <motion.div
    animate={{ rotate: 360 }}
    transition={{
      duration: 30,
      repeat: Infinity,
      ease: "linear",
    }}
    className="absolute inset-0 rounded-full border border-dashed border-violet-glow/25"
  />

  {/* Inner orbit */}
  <motion.div
    animate={{ rotate: -360 }}
    transition={{
      duration: 22,
      repeat: Infinity,
      ease: "linear",
    }}
    className="absolute inset-8 rounded-full border border-electric/20"
  />

  {/* Logo container */}
  <motion.div
    animate={{
      y: [0, -8, 0],
    }}
    transition={{
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="relative z-10 flex h-56 w-56 items-center justify-center"
  >
    <img
      src={matrixzLogo}
      alt="MATRIXZ"
      className="
        h-auto
        w-[90%]
        object-contain
        drop-shadow-[0_0_25px_rgba(139,92,246,0.45)]
      "
    />
  </motion.div>

  {/* Floating code icon */}
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    }}
    className="
      absolute
      left-0
      top-8
      z-20
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      border
      border-violet-glow/30
      bg-[#0b0d20]/80
      text-violet-glow
      shadow-[0_0_20px_rgba(139,92,246,0.2)]
      backdrop-blur-md
    "
  >
    <Code2 className="h-4 w-4" />
  </motion.div>

  {/* Floating target icon */}
  <motion.div
    animate={{ y: [0, 8, 0] }}
    transition={{
      duration: 4.5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 0.5,
    }}
    className="
      absolute
      right-0
      top-16
      z-20
      flex
      h-10
      w-10
      items-center
      justify-center
      rounded-xl
      border
      border-electric/30
      bg-[#0b0d20]/80
      text-electric-bright
      shadow-[0_0_20px_rgba(41,124,244,0.2)]
      backdrop-blur-md
    "
  >
    <Target className="h-4 w-4" />
  </motion.div>

  {/* Bottom glow */}
  <div className="absolute bottom-3 left-1/2 h-5 w-40 -translate-x-1/2 rounded-full bg-violet-glow/30 blur-2xl" />

  <div className="absolute bottom-4 left-1/2 h-1 w-32 -translate-x-1/2 rounded-full border border-violet-glow/50 bg-violet-glow/20" />
</motion.div>
          <div>
            <span className="eyebrow">About MATRIXZ</span>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-white sm:text-4xl">
              We are<br /><span className="text-gradient">MATRIXZ</span>
            </h2>
            <p className="mt-4 text-slate-400 leading-relaxed">
              A community of curious minds and problem solvers, bridging the gap between academics and industry by building skills, creating projects, and organizing impactful events.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {domains.map((d) => (
                <div key={d.title} className="glass-panel p-4">
                  <d.icon className="h-5 w-5 text-violet-glow" />
                  <div className="mt-2 text-sm font-medium text-white">{d.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{d.desc}</div>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-secondary mt-8">
              Know More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
  <span className="eyebrow">Club Teams</span>

  <h1
    className="text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Meet Our Teams
  </h1>
</div>
            <Link to="/teams" className="text-sm text-violet-glow hover:underline">View All Teams →</Link>
          </div>
          <div className="mt-10">
            {membersLoading ? (
              <LoadingSpinner />
            ) : topMembers.length === 0 ? (
              <EmptyState title="Our team page is warming up." description="Team member profiles will appear here soon." />
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {topMembers.map((m, i) => <TeamCard key={m._id} member={m} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS PREVIEW */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
           <div>
  <span className="eyebrow">Milestones</span>

  <h1
    className="text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Our Achievements
  </h1>
</div>
            <Link to="/achievements" className="text-sm text-violet-glow hover:underline">View All Achievements →</Link>
          </div>
          <div className="mt-10">
            {achLoading ? (
              <LoadingSpinner />
            ) : topAchievements.length === 0 ? (
              <EmptyState title="Our journey is just getting started." description="Achievements and milestones will be showcased here." />
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-4">
                {topAchievements.map((a, i) => <AchievementCard key={a._id} achievement={a} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
  <span className="eyebrow">What's Next</span>

  <h1
    className="text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Upcoming Events
  </h1>
</div>
            <Link to="/events" className="text-sm text-violet-glow hover:underline">View All Events →</Link>
          </div>
          <div className="mt-10">
            {eventsLoading ? (
              <LoadingSpinner />
            ) : topEvents.length === 0 ? (
              <EmptyState title="No upcoming events yet." description="Stay tuned — something exciting is coming." />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topEvents.map((e, i) => <EventCard key={e._id} event={e} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
  <span className="eyebrow">Moments That Matter</span>

  <h1
    className="text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Gallery
  </h1>
</div>
            <Link to="/gallery" className="text-sm text-violet-glow hover:underline">View Gallery →</Link>
          </div>
          <div className="mt-10">
            {galLoading ? (
              <LoadingSpinner />
            ) : topGallery.length === 0 ? (
              <EmptyState title="Memories are loading..." description="Photos from our events will appear here." />
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {topGallery.map((g, i) => (
                  <motion.div key={g._id} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="aspect-square overflow-hidden rounded-xl border border-white/[0.06]">
                    <img src={g.image.url} alt={g.title || "MATRIXZ"} className="h-full w-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section className="px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
  <div>
  <span className="eyebrow">Let's Talk</span>

  <h1
    className="text-5xl font-semibold tracking-wide text-white sm:text-6xl"
    style={{ fontFamily: "var(--font-premium)" }}
  >
    Get in Touch
  </h1>

  <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-400">
    Have a question, idea, or partnership in mind? We'd love to hear from you.
  </p>
</div>
  <div className="mt-6 flex gap-3">
    {/* Email */}
    <a
      href="mailto:matrixzpesce@gmail.com"
      aria-label="Email"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Mail className="h-4 w-4" />
    </a>

    {/* LinkedIn */}
    <a
      href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Linkedin className="h-4 w-4" />
    </a>

    {/* Instagram */}
    <a
      href="https://www.instagram.com/matrixz_cse_pesce"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition-all hover:border-violet-glow/50 hover:text-violet-glow"
    >
      <Instagram className="h-4 w-4" />
    </a>
  </div>
</div>
          <div className="glass-panel p-6">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="px-5 pb-24 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-violet-glow/20 bg-gradient-to-br from-violet-deep/25 via-void-raised to-electric/10 px-8 py-16 text-center">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-violet-glow/25 blur-[100px]" />
          <h2
  className="relative text-3xl font-semibold tracking-wide text-white sm:text-4xl"
  style={{ fontFamily: "var(--font-premium)" }}
>
  Be a part of MATRIXZ
</h2>
          <p className="relative mx-auto mt-4 max-w-lg text-slate-400">
            Follow along, come to our events, and build something great with a community that codes, creates, and conquers together.
          </p>
          <Link to="/events" className="btn-primary relative mt-8">
            Explore Events <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
