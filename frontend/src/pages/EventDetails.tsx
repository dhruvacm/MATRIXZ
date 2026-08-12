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
      <div className="px-5 py-24">
        <LoadingSpinner label="Loading event" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24">
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
    <div className="pb-24 pt-8">
      <div className="mx-auto max-w-5xl px-5 lg:px-8">
        <Link to="/events" className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-violet-glow">
          <ArrowLeft className="h-4 w-4" /> Back to Events
        </Link>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mt-6 overflow-hidden rounded-3xl border border-white/[0.06]">
          <div className="relative aspect-[21/9] w-full bg-gradient-to-br from-violet-deep/30 to-electric/20">
            {event.banner?.url ? (
              <img src={event.banner.url} alt={event.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <span className="font-display text-3xl text-white/30">MATRIXZ</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
          </div>
        </motion.div>

        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="eyebrow">{event.eventType} · {event.status}</span>
            <h1 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">{event.title}</h1>
            <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-400">{event.description}</p>

            {event.eligibility && (
              <div className="mt-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <ShieldCheck className="h-4 w-4 text-violet-glow" /> Eligibility
                </h3>
                <p className="mt-2 text-sm text-slate-400">{event.eligibility}</p>
              </div>
            )}

            {event.rules && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-white">Rules</h3>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{event.rules}</p>
              </div>
            )}

            {event.isPast && event.results && (
              <div className="mt-8">
                <h3 className="flex items-center gap-2 font-display text-lg font-semibold text-white">
                  <Trophy className="h-4 w-4 text-violet-glow" /> Results
                </h3>
                <p className="mt-2 whitespace-pre-line text-sm text-slate-400">{event.results}</p>
              </div>
            )}

            {(event.organizers || event.contactInfo) && (
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {event.organizers && (
                  <div className="glass-panel p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Organizers</div>
                    <div className="mt-1 text-sm text-slate-200">{event.organizers}</div>
                  </div>
                )}
                {event.contactInfo && (
                  <div className="glass-panel p-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500">Contact</div>
                    <div className="mt-1 text-sm text-slate-200">{event.contactInfo}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <motion.aside initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="glass-panel h-fit p-6">
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-violet-glow" />
                <div>
                  <div className="text-slate-200">{formatDate(event.date)}</div>
                  <div className="text-xs text-slate-500">Event date</div>
                </div>
              </div>
              {(event.startTime || event.endTime) && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-glow" />
                  <div>
                    <div className="text-slate-200">{event.startTime}{event.endTime ? ` – ${event.endTime}` : ""}</div>
                    <div className="text-xs text-slate-500">Timing</div>
                  </div>
                </div>
              )}
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-violet-glow" />
                <div>
                  <div className="text-slate-200">{event.venue}</div>
                  <div className="text-xs text-slate-500">Venue</div>
                </div>
              </div>
              {event.registrationDeadline && (
                <div className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-violet-glow" />
                  <div>
                    <div className="text-slate-200">{formatDate(event.registrationDeadline)}</div>
                    <div className="text-xs text-slate-500">Registration deadline</div>
                  </div>
                </div>
              )}
              {event.maxParticipants && (
                <div className="flex items-start gap-3">
                  <Users className="mt-0.5 h-4 w-4 shrink-0 text-violet-glow" />
                  <div>
                    <div className="text-slate-200">{event.maxParticipants} seats</div>
                    <div className="text-xs text-slate-500">Capacity</div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6">
              {canRegister ? (
                <a href={event.registrationUrl!} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                  Register Now <ExternalLink className="h-4 w-4" />
                </a>
              ) : event.isPast ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-slate-500">
                  This event has concluded
                </div>
              ) : (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-slate-500">
                  Registration is not open yet
                </div>
              )}
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}
