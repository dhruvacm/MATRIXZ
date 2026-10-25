import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ExternalLink, ArrowLeft, ShieldCheck, Trophy } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { eventService } from "@/services/eventService";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ErrorState } from "@/components/ErrorState";
import { formatDate, isPastDeadline } from "@/utils/format";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: event, loading, error, refetch } = useFetch(() => eventService.getById(id!), [id]);
  useDocumentTitle(event?.title ?? "Event Details");

  if (loading) {
    return (
      <div className="bg-[#F7F6F0] px-5 py-24">
        <LoadingSpinner label="Loading event record" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="bg-[#F7F6F0] mx-auto max-w-2xl px-5 py-24">
        <ErrorState message={error ?? "This event could not be found."} onRetry={refetch} />
      </div>
    );
  }

  const canRegister =
    event.registrationEnabled &&
    !!event.registrationUrl &&
    !isPastDeadline(event.registrationDeadline) &&
    ["Upcoming", "Registration Open"].includes(event.status);

  return (
    <div className="bg-[#F7F6F0] pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link
          to="/events"
          className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#6E7A71] transition-colors hover:text-[#214E3D]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Calendar
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 overflow-hidden rounded-lg border border-[#E1E4DC] bg-white shadow-subtle"
        >
          <div className="relative aspect-[21/9] w-full bg-[#FAF9F5]">
            {event.banner?.url ? (
              <img
                src={event.banner.url}
                alt={event.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#EDF3EE]">
                <span className="font-display text-4xl font-bold tracking-wider text-[#8CB8A5]">
                  MATRIXZ
                </span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="inline-block rounded border border-[#CAD9CC] bg-[#DCE8DE] px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-[#214E3D]">
              {event.eventType} • {event.status}
            </span>
            <h1 className="mt-2.5 font-display text-3xl font-extrabold tracking-tight text-[#202923] sm:text-4xl">
              {event.title}
            </h1>
            <p className="mt-5 whitespace-pre-line text-base leading-relaxed text-[#48544B]">
              {event.description}
            </p>

            {event.eligibility && (
              <div className="mt-8 rounded-lg border border-[#E1E4DC] bg-white p-5 shadow-subtle">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-[#202923]">
                  <ShieldCheck className="h-4 w-4 text-[#214E3D]" /> Eligibility Criteria
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#48544B]">
                  {event.eligibility}
                </p>
              </div>
            )}

            {event.rules && (
              <div className="mt-8 rounded-lg border border-[#E1E4DC] bg-white p-5 shadow-subtle">
                <h3 className="font-display text-base font-bold text-[#202923]">Rules & Guidelines</h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#48544B]">
                  {event.rules}
                </p>
              </div>
            )}

            {event.isPast && event.results && (
              <div className="mt-8 rounded-lg border border-[#8CB8A5] bg-[#EDF3EE] p-5 shadow-subtle">
                <h3 className="flex items-center gap-2 font-display text-base font-bold text-[#202923]">
                  <Trophy className="h-4 w-4 text-[#214E3D]" /> Results & Official Outcomes
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-[#202923]">
                  {event.results}
                </p>
              </div>
            )}

            {(event.organizers || event.contactInfo) && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {event.organizers && (
                  <div className="rounded-lg border border-[#E1E4DC] bg-white p-4 shadow-subtle">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E7A71]">
                      Organizers
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#202923]">
                      {event.organizers}
                    </div>
                  </div>
                )}
                {event.contactInfo && (
                  <div className="rounded-lg border border-[#E1E4DC] bg-white p-4 shadow-subtle">
                    <div className="font-mono text-[10px] font-semibold uppercase tracking-wider text-[#6E7A71]">
                      Official Contact
                    </div>
                    <div className="mt-1 text-sm font-semibold text-[#202923]">
                      {event.contactInfo}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <motion.aside
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="h-fit rounded-lg border border-[#E1E4DC] bg-white p-6 shadow-subtle"
          >
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                  <Calendar className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#202923]">{formatDate(event.date)}</div>
                  <div className="font-mono text-[11px] text-[#6E7A71]">Session date</div>
                </div>
              </div>

              {(event.startTime || event.endTime) && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#202923]">
                      {event.startTime}
                      {event.endTime ? ` – ${event.endTime}` : ""}
                    </div>
                    <div className="font-mono text-[11px] text-[#6E7A71]">Scheduled time</div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-[#202923]">{event.venue}</div>
                  <div className="font-mono text-[11px] text-[#6E7A71]">Venue</div>
                </div>
              </div>

              {event.registrationDeadline && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#202923]">
                      {formatDate(event.registrationDeadline)}
                    </div>
                    <div className="font-mono text-[11px] text-[#6E7A71]">Deadline</div>
                  </div>
                </div>
              )}

              {event.maxParticipants && (
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded border border-[#DCE8DE] bg-[#EDF3EE] text-[#214E3D]">
                    <Users className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-semibold text-[#202923]">
                      {event.maxParticipants} seats
                    </div>
                    <div className="font-mono text-[11px] text-[#6E7A71]">Capacity limit</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-[#E1E4DC] pt-6">
              {canRegister ? (
                <a
                  href={event.registrationUrl!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex w-full items-center justify-center gap-1.5 py-2.5 text-center text-sm font-semibold"
                >
                  Register Now <ExternalLink className="h-4 w-4" />
                </a>
              ) : event.isPast ? (
                <div className="rounded border border-[#E1E4DC] bg-[#FAF9F5] px-4 py-2.5 text-center font-mono text-xs text-[#6E7A71]">
                  Event has concluded
                </div>
              ) : (
                <div className="rounded border border-[#E1E4DC] bg-[#FAF9F5] px-4 py-2.5 text-center font-mono text-xs text-[#6E7A71]">
                  Registration not open
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
