import { useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { galleryService } from "@/services/galleryService";
import { getApiErrorMessage } from "@/services/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { Upload, Trash2, ImagePlus } from "lucide-react";
import { GalleryImage, GalleryCategory } from "@/types";

const categories: GalleryCategory[] = ["Events", "Workshops", "Hackathons", "Competitions", "Team", "Other"];

export default function AdminGallery() {
  useDocumentTitle("Gallery");
  const { showToast } = useToast();
  const { data, loading, refetch } = useFetch(() => galleryService.listAdmin());

  const [filter, setFilter] = useState<"All" | GalleryCategory>("All");
  const filtered = (data ?? []).filter((g) => filter === "All" || g.category === filter);

  const [uploadOpen, setUploadOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("Events");
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);

  function openUpload() {
    setFiles([]);
    setTitle("");
    setDescription("");
    setCategory("Events");
    setUploadOpen(true);
  }

  async function handleUpload() {
    if (files.length === 0) {
      showToast("Please select at least one image", "error");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("images", f));
      formData.append("category", category);
      if (title) formData.append("title", title);
      if (description) formData.append("description", description);
      await galleryService.upload(formData);
      showToast("Images uploaded successfully", "success");
      setUploadOpen(false);
      refetch();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await galleryService.remove(deleteTarget._id);
      showToast("Image deleted successfully", "success");
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
          <h1 className="font-display text-2xl font-semibold text-white">Gallery</h1>
          <p className="mt-1 text-sm text-slate-500">Upload and organize event photos.</p>
        </div>
        <button onClick={openUpload} className="btn-primary text-sm">
          <Upload className="h-4 w-4" /> Upload Images
        </button>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(["All", ...categories] as const).map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`rounded-full px-4 py-2 text-xs font-medium ${filter === c ? "bg-violet-glow text-white" : "border border-white/10 text-slate-400"}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading gallery" />
        ) : filtered.length === 0 ? (
          <EmptyState title="No images yet." description="Upload your first batch of photos above." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {filtered.map((g) => (
              <div key={g._id} className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06]">
                <img src={g.image.url} alt={g.title || "MATRIXZ gallery"} className="h-full w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 flex flex-col justify-between bg-black/0 p-2 opacity-0 transition-opacity group-hover:bg-black/50 group-hover:opacity-100">
                  <span className="self-start rounded-full bg-void/80 px-2 py-0.5 text-[10px] text-slate-200">{g.category}</span>
                  <button
                    onClick={() => setDeleteTarget(g)}
                    aria-label="Delete image"
                    className="self-end rounded-full bg-rose-500/80 p-1.5 text-white hover:bg-rose-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Images" maxWidth="max-w-lg">
        <div className="space-y-4">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-8 text-sm text-slate-400 hover:border-violet-glow/40">
            <ImagePlus className="h-5 w-5" />
            {files.length > 0 ? `${files.length} image(s) selected` : "Click to select images"}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => setFiles(e.target.files ? Array.from(e.target.files) : [])}
            />
          </label>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value as GalleryCategory)} className="input">
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Title (optional)</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Applies to all selected images" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-400">Description (optional)</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} className="input resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setUploadOpen(false)} className="btn-secondary">Cancel</button>
            <button type="button" disabled={uploading} onClick={handleUpload} className="btn-primary">
              {uploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete image"
        message="Are you sure you want to delete this image? This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
