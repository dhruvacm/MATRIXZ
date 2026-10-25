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
import { EventCard } from "@/components/EventCard";
import { TeamCard } from "@/components/TeamCard";
import { AchievementCard } from "@/components/AchievementCard";
import { EmptyState } from "@/components/EmptyState";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ContactForm } from "@/components/ContactForm";
import CSNetwork3D from "@/components/CSNetwork3D";
import matrixzLogo from "@/assets/matrixz-logo.png";

const domains = [
  { icon: Lightbulb, title: "Innovation", desc: "We encourage original ideas and algorithmic thinking." },
  { icon: Users2, title: "Collaboration", desc: "We build distributed, cooperative engineering teams." },
  { icon: BookOpen, title: "Learning", desc: "Hands-on projects bridging core systems with modern frameworks." },
  { icon: Target, title: "Impact", desc: "Building software and research solutions with tangible value." },
];

export default function Home() {
  useDocumentTitle("Home");

  const { data: upcomingEvents, loading: eventsLoading } = useFetch(() =>
    eventService.list("upcoming")
  );
  const { data: members, loading: membersLoading } = useFetch(() =>
    teamService.listMembers()
  );
  const { data: achievements, loading: achLoading } = useFetch(() =>
    achievementService.list()
  );
  const { data: galleryImages, loading: galLoading } = useFetch(() =>
    galleryService.list()
  );
  const { data: teams, loading: teamsLoading } = useFetch(() =>
    teamService.listTeams()
  );
  const { data: pastEvents } = useFetch(() =>
    eventService.list("past")
  );

  const topEvents = upcomingEvents?.slice(0, 3) ?? [];
  const topMembers = members?.slice(0, 12) ?? [];
  const topAchievements = achievements?.slice(0, 4) ?? [];
  const topGallery = galleryImages?.slice(0, 5) ?? [];

  return (
    <div className="bg-[#F7F6F0]">
      {/* HERO SECTION */}
      <section className="relative border-b border-[#E1E4DC] px-5 pb-20 pt-12 lg:min-h-[640px] lg:px-8 lg:pb-24">
        {/* Vertical social rail */}
        <div className="absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col gap-3 lg:flex">
          <a
            href="https://www.instagram.com/matrixz_cse_pesce"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-[#DCE8DE]/50 hover:text-[#214E3D]"
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-[#DCE8DE]/50 hover:text-[#214E3D]"
          >
            <Linkedin className="h-4 w-4" />
          </a>
          <a
            href="mailto:matrixzpesce@gmail.com"
            aria-label="Email"
            className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-[#DCE8DE]/50 hover:text-[#214E3D]"
          >
            <Mail className="h-4 w-4" />
          </a>
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:pr-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-3 py-1 font-mono text-xs font-semibold uppercase tracking-wider text-[#214E3D]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#214E3D]" />
              Department Technical Society
            </div>

            <h1 className="mt-4 font-display text-5xl font-extrabold tracking-tight text-[#202923] sm:text-6xl lg:text-7xl">
              MATRIXZ
            </h1>

            <p className="mt-2 font-display text-xl font-bold uppercase tracking-wide text-[#214E3D] sm:text-2xl">
              Compile. Save. Execute.
            </p>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#48544B] sm:text-lg">
              The official technical student society of our Computer Science & Engineering department,
              advancing computing systems, algorithm development, and engineering research.
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link to="/about" className="btn-primary">
                Explore MATRIXZ <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/events" className="btn-secondary">
                Upcoming Events
              </Link>
            </div>

            {/* Live Statistics Row */}
            <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  icon: Users2,
                  value: `${members?.length ?? 0}+`,
                  label: "Active Members",
                },
                {
                  icon: CalendarDays,
                  value: `${pastEvents?.length ?? 0}+`,
                  label: "Completed Events",
                },
                {
                  icon: Trophy,
                  value: `${achievements?.length ?? 0}+`,
                  label: "Awards & Honors",
                },
                {
                  icon: Code2,
                  value: `${teams?.length ?? 0}+`,
                  label: "Specialized Teams",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-[#E1E4DC] bg-white p-4 shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                    <s.icon className="h-4 w-4" />
                  </div>
                  <div className="mt-3 font-display text-2xl font-bold text-[#202923]">
                    {s.value}
                  </div>
                  <div className="mt-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E7A71]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Real Three.js orbital network model (replaces the previous flat visual) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative h-[360px] w-full sm:h-[440px] lg:h-[500px]"
          >
            <CSNetwork3D className="w-full" quality="high" />
          </motion.div>
        </div>
      </section>

      {/* ABOUT PREVIEW */}
      <section className="border-b border-[#E1E4DC] bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
          {/* Subtle Monogram / Society Crest */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto flex h-72 w-72 items-center justify-center rounded-xl border border-[#E1E4DC] bg-[#FAF9F5] p-8 shadow-subtle sm:h-80 sm:w-80"
          >
            <div className="absolute inset-4 rounded-lg border border-dashed border-[#DCE8DE]" />
            <img
              src={matrixzLogo}
              alt="MATRIXZ"
              className="relative z-10 max-h-48 w-auto object-contain"
            />
          </motion.div>

          <div>
            <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              About MATRIXZ
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
              Fostering Rigorous Technical Inquiry
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#48544B]">
              A community of student engineers, researchers, and builders bridging the gap between
              rigorous academic theory and real-world software architecture through hackathons,
              technical seminars, and production projects.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3.5">
              {domains.map((d) => (
                <div
                  key={d.title}
                  className="rounded-lg border border-[#E1E4DC] bg-[#FAF9F5] p-4 transition-all duration-200 hover:border-[#8CB8A5] hover:bg-white hover:shadow-subtle"
                >
                  <d.icon className="h-5 w-5 text-[#214E3D]" />
                  <div className="mt-2.5 font-display text-sm font-bold text-[#202923]">
                    {d.title}
                  </div>
                  <div className="mt-1 text-xs leading-relaxed text-[#6E7A71]">
                    {d.desc}
                  </div>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-secondary mt-8 inline-flex items-center gap-2">
              Know More About Us <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="border-b border-[#E1E4DC] bg-[#EDF3EE] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded border border-[#CAD9CC] bg-[#DCE8DE] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
                Specialized Divisions
              </span>
              <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
                Meet Our Teams
              </h2>
            </div>
            <Link
              to="/teams"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[#214E3D] transition-colors hover:text-[#1A3E30] hover:underline"
            >
              View All Teams →
            </Link>
          </div>
          <div className="mt-10">
            {membersLoading ? (
              <LoadingSpinner />
            ) : topMembers.length === 0 ? (
              <EmptyState
                title="Our team page is warming up."
                description="Team member profiles will appear here soon."
              />
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {topMembers.map((m, i) => (
                  <TeamCard key={m._id} member={m} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENTS PREVIEW */}
      <section className="border-b border-[#E1E4DC] bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
                Recognitions & Milestones
              </span>
              <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
                Our Achievements
              </h2>
            </div>
            <Link
              to="/achievements"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[#214E3D] transition-colors hover:text-[#1A3E30] hover:underline"
            >
              View All Achievements →
            </Link>
          </div>
          <div className="mt-10">
            {achLoading ? (
              <LoadingSpinner />
            ) : topAchievements.length === 0 ? (
              <EmptyState
                title="Our journey is just getting started."
                description="Achievements and milestones will be showcased here."
              />
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {topAchievements.map((a, i) => (
                  <AchievementCard key={a._id} achievement={a} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS PREVIEW */}
      <section className="border-b border-[#E1E4DC] bg-[#F7F6F0] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
                Seminars & Hackathons
              </span>
              <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
                Upcoming Events
              </h2>
            </div>
            <Link
              to="/events"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[#214E3D] transition-colors hover:text-[#1A3E30] hover:underline"
            >
              View All Events →
            </Link>
          </div>
          <div className="mt-10">
            {eventsLoading ? (
              <LoadingSpinner />
            ) : topEvents.length === 0 ? (
              <EmptyState
                title="No upcoming events scheduled."
                description="Technical seminars and competition announcements will be posted here."
              />
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {topEvents.map((e, i) => (
                  <EventCard key={e._id} event={e} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="border-b border-[#E1E4DC] bg-white px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="inline-block rounded border border-[#E1E4DC] bg-[#DCE8DE]/60 px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
                Visual Archive
              </span>
              <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
                Event Gallery
              </h2>
            </div>
            <Link
              to="/gallery"
              className="font-mono text-xs font-semibold uppercase tracking-wider text-[#214E3D] transition-colors hover:text-[#1A3E30] hover:underline"
            >
              View Gallery →
            </Link>
          </div>
          <div className="mt-10">
            {galLoading ? (
              <LoadingSpinner />
            ) : topGallery.length === 0 ? (
              <EmptyState
                title="Archive is being indexed..."
                description="Photographs from our technical sessions will appear here."
              />
            ) : (
              <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-5">
                {topGallery.map((g, i) => (
                  <motion.div
                    key={g._id}
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="aspect-square overflow-hidden rounded-md border border-[#E1E4DC] bg-[#F7F6F0] shadow-subtle"
                  >
                    <img
                      src={g.image.url}
                      alt={g.title || "MATRIXZ"}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      loading="lazy"
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CONTACT PREVIEW */}
      <section className="border-b border-[#E1E4DC] bg-[#EDF3EE] px-5 py-20 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-block rounded border border-[#CAD9CC] bg-[#DCE8DE] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              Direct Inquiry
            </span>
            <h2 className="mt-2.5 font-display text-3xl font-bold tracking-tight text-[#202923] sm:text-4xl">
              Get in Touch
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-[#48544B]">
              Interested in speaking at a technical seminar, sponsoring a hackathon, or joining our research cohorts?
            </p>

            <div className="mt-8 flex gap-3">
              <a
                href="mailto:matrixzpesce@gmail.com"
                aria-label="Email"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-white hover:text-[#214E3D]"
              >
                <Mail className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/matrixz-pesce-4891bb429/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-white hover:text-[#214E3D]"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/matrixz_cse_pesce"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-md border border-[#E1E4DC] bg-white text-[#48544B] shadow-subtle transition-all hover:border-[#8CB8A5] hover:bg-white hover:text-[#214E3D]"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-[#E1E4DC] bg-white p-6 shadow-subtle sm:p-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* JOIN CTA */}
      <section className="px-5 py-20 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-xl border border-[#1A3E30] bg-[#214E3D] px-8 py-14 text-center text-white shadow-card"
        >
          <span className="inline-block rounded border border-[#8CB8A5]/40 bg-[#1A3E30] px-3 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#8CB8A5]">
            Engineering Community
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Be a Part of MATRIXZ
          </h2>
          <p className="relative mx-auto mt-3 max-w-lg text-base text-[#DCE8DE]">
            Participate in upcoming symposia, join a development cohort, and build peer-driven technology initiatives.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 rounded-md bg-white px-5 py-2.5 font-display text-sm font-semibold text-[#214E3D] shadow-sm transition-all hover:bg-[#F7F6F0]"
            >
              Explore Events <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
