import { useEffect, useState } from "react";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useFetch } from "@/hooks/useFetch";
import { contactService } from "@/services/contactService";
import { getApiErrorMessage } from "@/services/api";
import { useToast } from "@/context/ToastContext";
import { Modal } from "@/components/Modal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { EmptyState } from "@/components/EmptyState";
import { Eye, Trash2, Mail, MailOpen } from "lucide-react";
import { ContactMessage } from "@/types";
import { formatDate } from "@/utils/format";

export default function AdminMessages() {
  useDocumentTitle("Contact Messages");
  const { showToast } = useToast();
  const { data, loading, refetch } =
  useFetch(() => contactService.list(), [], 5000);

useEffect(() => {
  const interval = setInterval(() => {
    refetch();
  }, 5000);

  return () => clearInterval(interval);
}, [refetch]);
  const [viewing, setViewing] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  async function openMessage(message: ContactMessage) {
    setViewing(message);
    if (!message.isRead) {
      try {
        await contactService.markRead(message._id);
        refetch();
      } catch {
        // Non-fatal: viewing still works even if marking read fails.
      }
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await contactService.remove(deleteTarget._id);
      showToast("Message deleted successfully", "success");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getApiErrorMessage(err), "error");
    }
  }

  const unreadCount = (data ?? []).filter((m) => !m.isRead).length;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Contact Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            {unreadCount > 0 ? `${unreadCount} unread message${unreadCount === 1 ? "" : "s"}` : "All caught up."}
          </p>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingSpinner label="Loading messages" />
        ) : !data || data.length === 0 ? (
          <EmptyState title="No messages yet." description="Messages submitted through the contact form will appear here." />
        ) : (
          <div className="glass-panel overflow-x-auto p-0">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-4 font-medium">From</th>
                  <th className="px-5 py-4 font-medium">Subject</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((m) => (
                  <tr key={m._id} className={`border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] ${!m.isRead ? "bg-violet-glow/[0.03]" : ""}`}>
                    <td className="px-5 py-4">
                      <div className="text-slate-200">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.email}</div>
                    </td>
                    <td className="px-5 py-4 text-slate-400 line-clamp-1 max-w-[220px]">{m.subject}</td>
                    <td className="px-5 py-4 text-slate-400">{formatDate(m.createdAt)}</td>
                    <td className="px-5 py-4">
                      {m.isRead ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-slate-400"><MailOpen className="h-3 w-3" /> Read</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-violet-glow/10 px-2.5 py-1 text-[11px] text-violet-glow"><Mail className="h-3 w-3" /> Unread</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openMessage(m)} aria-label="View message" className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-slate-100">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button onClick={() => setDeleteTarget(m)} aria-label="Delete message" className="rounded-lg p-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400">
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

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.subject ?? "Message"} maxWidth="max-w-lg">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="text-slate-200">{viewing.name}</div>
                <div className="text-xs text-slate-500">{viewing.email}</div>
              </div>
              <span className="text-xs text-slate-500">{formatDate(viewing.createdAt)}</span>
            </div>
            <p className="whitespace-pre-line rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm leading-relaxed text-slate-300">
              {viewing.message}
            </p>
            <div className="flex justify-end">
              <a href={`mailto:${viewing.email}`} className="btn-primary text-sm">Reply via Email</a>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete message"
        message="Are you sure you want to delete this message? This action cannot be undone."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
