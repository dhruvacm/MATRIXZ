import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ExternalLink } from "lucide-react";
import { MatrixzEvent } from "@/types";
import { formatDay, formatMonth, isPastDeadline } from "@/utils/format";

export function EventCard({
  event,
  index = 0,
}: {
  event: MatrixzEvent;
  index?: number;
}) {
  const canRegister =
    event.registrationEnabled &&
    !!event.registrationUrl &&
    !isPastDeadline(event.registrationDeadline) &&
    ["Upcoming", "Registration Open"].includes(event.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="glass-card group flex flex-col overflow-hidden"
    >
      {/* FULL BANNER IMAGE */}
      <Link
        to={`/events/${event.slug}`}
        className="relative block w-full overflow-hidden bg-void-raised"
      >
        {event.banner?.url ? (
          <img
            src={event.banner.url}
            alt={event.title}
            className="block h-auto w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br from-violet-deep/30 to-electric/20">
            <span className="font-display text-2xl text-white/30">
              MATRIXZ
            </span>
          </div>
        )}

        {/* DATE */}
        <div className="absolute left-3 top-3 rounded-lg bg-void/80 px-2.5 py-1.5 text-center leading-none backdrop-blur-md">
          <div className="font-mono text-[10px] uppercase tracking-wide text-violet-glow">
            {formatMonth(event.date)}
          </div>

          <div className="text-lg font-semibold text-white">
            {formatDay(event.date)}
          </div>
        </div>

        {/* EVENT TYPE */}
        <span className="absolute right-3 top-3 rounded-full border border-violet-glow/30 bg-violet-glow/15 px-2.5 py-1 text-[11px] font-medium text-violet-glow backdrop-blur-md">
          {event.eventType}
        </span>
      </Link>

      {/* EVENT INFORMATION */}
      <div className="flex flex-1 flex-col p-5">
        <Link to={`/events/${event.slug}`}>
          <h3 className="line-clamp-2 font-display text-lg font-semibold text-white transition-colors group-hover:text-violet-glow">
            {event.title}
          </h3>
        </Link>

        {/* VENUE */}
        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="h-3.5 w-3.5 shrink-0" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>

        {/* DESCRIPTION */}
        <p className="mt-3 line-clamp-2 flex-1 text-sm text-slate-400">
          {event.description}
        </p>

        {/* ACTION */}
        <div className="mt-5">
          {canRegister ? (
            <a
              href={event.registrationUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full py-2.5 text-sm"
            >
              Register Now
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link
              to={`/events/${event.slug}`}
              className="btn-secondary w-full py-2.5 text-sm"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}