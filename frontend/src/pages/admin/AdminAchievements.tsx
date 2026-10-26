import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, ImagePlus } from "lucide-react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { achievementService } from "@/services/achievementService";
import { getApiErrorMessage } from "@/services/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { formatDate } from "@/utils/format";
import { Achievement, AchievementCategory } from "@/types";

const categories: AchievementCategory[] = ["Hackathons", "Competitions", "Awards", "Certifications", "Other"];

const schema = z.object({
  title: z.string().min(3, "Title is required."),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required."),
  category: z.enum(["Hackathons", "Competitions", "Awards", "Certifications", "Other"]),
  position: z.string().optional(),
  teamOrMember: z.string().optional(),
  externalLink: z.string().url().optional().or(z.literal("")),
  displayOrder: z.string().optional(),
  isPublished: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AdminAchievements() {
  useDocumentTitle("Achievements");
  const { showToast } = useToast();
  const { data, loading, refetch } = useFetch(() => achievementService.listAdmin());

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Achievement | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null);

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function openCreate() {
    setEditing(null);
    setImage(null);
    reset({ title: "", description: "", date: "", category: "Hackathons", position: "", teamOrMember: "", externalLink: "", displayOrder: "0", isPublished: true });
    setModalOpen(true);
  }
  function openEdit(a: Achievement) {
    setEditing(a);
    setImage(null);
    reset({
      title: a.title, description: a.description ?? "", date: new Date(a.date).toISOString().slice(0, 10),
      category: a.category, position: a.position ?? "", teamOrMember: a.teamOrMember ?? "",
      externalLink: a.externalLink ?? "", displayOrder: String(a.displayOrder), isPublished: a.isPublished,
    });
    setModalOpen(true);
  }
  async function onSubmit(values: FormData) {
    try {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        formData.append(key, key === "isPublished" ? String(!!value) : String(value));
      });
      if (image) formData.append("image", image);

      if (editing) {
        await achievementService.update(editing._id, formData);
        showToast("Achievement updated successfully", "success");
      } else {
        await achievementService.create(formData);
        showToast("Achievement added successfully", "success");
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
      await achievementService.remove(deleteTarget._id);
      showToast("Achievement deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Achievements</h1>
          <p className="mt-1 text-sm text-slate-500">Showcase MATRIXZ wins, awards, and certifications.</p>
        </div>
        <button onClick={openCreate} className="btn-primary text-sm"><Plus className="h-4 w-4" /> Add Achievement</button>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading achievements" />
        ) : !data || data.length === 0 ? (
          <EmptyState title="No achievements yet." description="Add your first achievement above." />
        ) : (
          <div className="glass-panel overflow-x-auto p-0">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-medium">Title</th>
                  <th className="px-5 py-4 font-medium">Category</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((a) => (
                  <tr key={a._id} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02]">
                    <td className="px-5 py-4 text-slate-200">{a.title}</td>
                    <td className="px-5 py-4 text-slate-400">{a.category}</td>
                    <td className="px-5 py-4 text-slate-400">{formatDate(a.date)}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] ${a.isPublished ? "bg-emerald-500/10 text-emerald-400" : "bg-white/5 text-slate-500"}`}>
                        {a.isPublished ? "Published" : "Hidden"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openEdit(a)} aria-label="Edit achievement" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100"><Pencil className="h-4 w-4" /></button>
                        <button onClick={() => setDeleteTarget(a)} aria-label="Delete achievement" className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Achievement" : "Add Achievement"} maxWidth="max-w-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Title</label>
              <input {...register("title")} className="input" placeholder="Code Crusaders 2024" />
              {errors.title && <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>

              <select
                {...register("category")}
                className="input [&>option]:bg-[#191a2e] [&>option]:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Date</label>
              <input type="date" {...register("date")} className="input" />
              {errors.date && <p className="mt-1 text-xs text-rose-400">{errors.date.message}</p>}
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Description</label>
              <textarea rows={2} {...register("description")} className="input resize-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Position / Result</label>
              <input {...register("position")} className="input" placeholder="Winner, 1st Runner Up..." />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Team / Member</label>
              <input {...register("teamOrMember")} className="input" placeholder="Optional" />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-400">External Link</label>
              <input {...register("externalLink")} className="input" placeholder="https://..." />
              {errors.externalLink && <p className="mt-1 text-xs text-rose-400">{errors.externalLink.message}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-400">Display Order</label>
              <input type="number" {...register("displayOrder")} className="input" />
            </div>
            <div className="sm:col-span-2">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-6 text-sm text-slate-400 hover:border-violet-glow/40">
                <ImagePlus className="h-4 w-4" />
                {image ? image.name : editing?.image?.url ? "Replace image" : "Upload image"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <label className="flex items-center gap-2 text-xs text-slate-400 sm:col-span-2">
              <input type="checkbox" {...register("isPublished")} className="h-4 w-4 rounded border-white/20 bg-white/5 accent-violet-glow" />
              Published on public site
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">{editing ? "Save Changes" : "Add Achievement"}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete achievement"
        message={`Are you sure you want to delete "${deleteTarget?.title}"?`}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
