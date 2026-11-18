
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, ExternalLink, FileText } from "lucide-react";
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
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group flex flex-col overflow-hidden rounded-lg border border-[#E1E4DC] bg-white shadow-subtle transition-all duration-200 hover:-translate-y-0.5 hover:border-[#8CB8A5] hover:shadow-card"
    >
      <div className="relative">
        <Link
          to={`/events/${event.slug}`}
          className="block w-full overflow-hidden bg-[#FAF9F5]"
        >
          {event.banner?.url ? (
            <img
              src={event.banner.url}
              alt={event.title}
              className="block h-auto max-h-[420px] w-full object-contain transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex h-[220px] w-full items-center justify-center bg-[#EDF3EE]">
              <span className="font-display text-xl font-bold tracking-wider text-[#8CB8A5]">
                MATRIXZ
              </span>
            </div>
          )}
        </Link>

        <div className="absolute left-3 top-3 rounded border border-[#E1E4DC] bg-[#F7F6F0]/95 px-2.5 py-1 text-center leading-none shadow-subtle backdrop-blur-sm">
          <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#214E3D]">
            {formatMonth(event.date)}
          </div>
          <div className="mt-0.5 font-display text-base font-bold text-[#202923]">
            {formatDay(event.date)}
          </div>
        </div>

        <span className="absolute right-3 top-3 rounded border border-[#CAD9CC] bg-[#DCE8DE]/95 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[#214E3D] shadow-subtle backdrop-blur-sm">
          {event.eventType}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <Link to={`/events/${event.slug}`}>
          <h3 className="line-clamp-2 font-display text-base font-bold text-[#202923] transition-colors group-hover:text-[#214E3D]">
            {event.title}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1.5 text-xs text-[#6E7A71]">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#8CB8A5]" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>

        <p className="mt-2.5 line-clamp-2 flex-1 text-sm leading-relaxed text-[#48544B]">
          {event.description}
        </p>

        <div className="mt-5 flex flex-col gap-2">
          {canRegister ? (
            <a
              href={event.registrationUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary flex w-full items-center justify-center gap-1.5 py-2 text-center text-xs"
            >
              Register Now
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <Link
              to={`/events/${event.slug}`}
              className="btn-secondary block w-full py-2 text-center text-xs"
            >
              View Details
            </Link>
          )}

          {event.report?.url && (
            <a
              href={event.report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-1.5 rounded border border-[#CAD9CC] bg-[#F7F6F0] py-2 text-center text-xs font-semibold text-[#214E3D] transition-colors hover:bg-[#DCE8DE]"
            >
              <FileText className="h-3.5 w-3.5" />
              View Event Report
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
