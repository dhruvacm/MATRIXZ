import { useMemo, useState } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, Copy, ExternalLink, ImagePlus } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { eventService } from "@/services/eventService";
import { getApiErrorMessage } from "@/services/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import { formatDate } from "@/utils/format";
import { MatrixzEvent, EventStatus, EventType } from "@/types";

const eventTypes: EventType[] = ["Hackathon", "Workshop", "Tech Talk", "Competition", "Seminar", "Other"];
const statuses: EventStatus[] = ["Draft", "Upcoming", "Registration Open", "Registration Closed", "Completed", "Cancelled"];

const schema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  eventType: z.enum(["Hackathon", "Workshop", "Tech Talk", "Competition", "Seminar", "Other"]),
  description: z.string().min(10, "Description must be at least 10 characters."),
  date: z.string().min(1, "Date is required."),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  venue: z.string().min(2, "Venue is required."),
  eligibility: z.string().optional(),
  registrationDeadline: z.string().optional(),
  maxParticipants: z.string().optional(),
  registrationEnabled: z.boolean().optional(),
  registrationUrl: z.string().url("Enter a valid Google Form URL.").optional().or(z.literal("")),
  status: z.enum(["Draft", "Upcoming", "Registration Open", "Registration Closed", "Completed", "Cancelled"]),
  rules: z.string().optional(),
  organizers: z.string().optional(),
  contactInfo: z.string().optional(),
  results: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function toDateInput(value?: string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export default function AdminEvents() {
  const { tab } = useParams<{ tab: string }>();
  const validTab = tab === "past" ? "past" : "upcoming";
  useDocumentTitle(validTab === "past" ? "Past Events" : "Upcoming Events");
  const { showToast } = useToast();

  const { data, loading, error, refetch } = useFetch(() => eventService.listAllAdmin());
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<MatrixzEvent | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MatrixzEvent | null>(null);

  const filtered = useMemo(() => (data ?? []).filter((e) => (validTab === "upcoming" ? !e.isPast : e.isPast)), [data, validTab]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  if (tab !== "upcoming" && tab !== "past") {
    return <Navigate to="/admin/events/upcoming" replace />;
  }

  function openCreate() {
    setEditing(null);
    setBannerFile(null);
    reset({
      title: "", eventType: "Workshop", description: "", date: "", startTime: "", endTime: "", venue: "",
      eligibility: "", registrationDeadline: "", maxParticipants: "", registrationEnabled: false, registrationUrl: "",
      status: "Draft", rules: "", organizers: "", contactInfo: "", results: "",
    });
    setModalOpen(true);
  }

  function openEdit(event: MatrixzEvent) {
    setEditing(event);
    setBannerFile(null);
    reset({
      title: event.title,
      eventType: event.eventType,
      description: event.description,
      date: toDateInput(event.date),
      startTime: event.startTime ?? "",
      endTime: event.endTime ?? "",
      venue: event.venue,
      eligibility: event.eligibility ?? "",
      registrationDeadline: toDateInput(event.registrationDeadline),
      maxParticipants: event.maxParticipants ? String(event.maxParticipants) : "",
      registrationEnabled: event.registrationEnabled,
      registrationUrl: event.registrationUrl ?? "",
      status: event.status,
      rules: event.rules ?? "",
      organizers: event.organizers ?? "",
      contactInfo: event.contactInfo ?? "",
      results: event.results ?? "",
    });
    setModalOpen(true);
  }

  async function onSubmit(values: FormData) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (key === "registrationEnabled") {
          formData.append(key, String(!!value));
        } else {
          formData.append(key, String(value));
        }
      });
      if (bannerFile) formData.append("banner", bannerFile);

      if (editing) {
        await eventService.update(editing._id, formData);
        showToast("Event updated successfully", "success");
      } else {
        await eventService.create(formData);
        showToast("Event created successfully", "success");
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await eventService.remove(deleteTarget._id);
      showToast("Event deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  async function handleDuplicate(event: MatrixzEvent) {
    try {
      await eventService.duplicate(event._id);
      showToast("Event duplicated successfully", "success");
      refetch();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Events</h1>
          <p className="mt-1 text-sm text-slate-500">Manage upcoming and past MATRIXZ events.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm">
          <Plus className="h-4 w-4" /> Add Event
        </button>
      </div>

      <div className="mt-6 flex gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1 w-fit">
        <Link to="/admin/events/upcoming" className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === "upcoming" ? "bg-violet-glow text-white" : "text-slate-400 hover:text-slate-200"}`}>
          Upcoming Events
        </Link>
        <Link to="/admin/events/past" className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${tab === "past" ? "bg-violet-glow text-white" : "text-slate-400 hover:text-slate-200"}`}>
          Past Events
        </Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading events" />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : filtered.length === 0 ? (
          <EmptyState title="No events here yet." description="Create your first event using the Add Event button." />
        ) : (
          <div className="glass-panel overflow-x-auto p-0">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-medium">Event</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Registration</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4 text-slate-200">{e.title}</td>
                    <td className="px-5 py-4 text-slate-400">{formatDate(e.date)}</td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-violet-glow/10 px-2.5 py-1 text-[11px] text-violet-glow">{e.status}</span>
                    </td>
                    <td className="px-5 py-4">
                      {e.registrationEnabled && e.registrationUrl ? (
                        <a href={e.registrationUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-violet-glow hover:underline">
                          Google Form <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-slate-600">Disabled</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleDuplicate(e)} aria-label="Duplicate event" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100">
                          <Copy className="h-4 w-4" />
                        </button>
                        <button onClick={() => openEdit(e)} aria-label="Edit event" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(e)} aria-label="Delete event" className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Event" : "Add Event"} maxWidth="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Title</label>
              <input {...register("title")} className="input" placeholder="MATRIXZ Hackathon 2.0" />
              {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Event Type</label>
              <select {...register("eventType")} className="input">
                {eventTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Status</label>
              <select {...register("status")} className="input">
                {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
              <textarea rows={3} {...register("description")} className="input resize-none" placeholder="What is this event about?" />
              {errors.description && <p className="mt-1 text-xs text-rose-400">{errors.description.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
              <input type="date" {...register("date")} className="input" />
              {errors.date && <p className="mt-1 text-xs text-rose-400">{errors.date.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Venue</label>
              <input {...register("venue")} className="input" placeholder="PESCE, Mandya" />
              {errors.venue && <p className="mt-1 text-xs text-rose-400">{errors.venue.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Start Time</label>
              <input type="time" {...register("startTime")} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">End Time</label>
              <input type="time" {...register("endTime")} className="input" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Eligibility</label>
              <input {...register("eligibility")} className="input" placeholder="Open to all department students" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Registration Deadline</label>
              <input type="date" {...register("registrationDeadline")} className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Max Participants</label>
              <input type="number" min={1} {...register("maxParticipants")} className="input" placeholder="Optional" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Google Form Registration URL</label>
              <input {...register("registrationUrl")} className="input" placeholder="https://forms.google.com/..." />
              {errors.registrationUrl && <p className="mt-1 text-xs text-rose-400">{errors.registrationUrl.message}</p>}
              <label className="mt-2 flex items-center gap-2 text-xs text-slate-400">
                <input type="checkbox" {...register("registrationEnabled")} className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-glow" />
                Show "Register Now" button on the public site
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Rules</label>
              <textarea rows={2} {...register("rules")} className="input resize-none" placeholder="Optional rules or guidelines" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Organizers</label>
              <input {...register("organizers")} className="input" placeholder="MATRIXZ Core Team" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Contact Info</label>
              <input {...register("contactInfo")} className="input" placeholder="matrixz.club@pesce.ac.in" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Results (for past events)</label>
              <textarea rows={2} {...register("results")} className="input resize-none" placeholder="Winners, outcomes, highlights" />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Banner Image</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-sm text-slate-400 hover:border-violet-glow/40">
                <ImagePlus className="h-4 w-4" />
                {bannerFile ? bannerFile.name : editing?.banner?.url ? "Replace current banner" : "Click to upload an image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Saving..." : editing ? "Save Changes" : "Create Event"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete event"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
