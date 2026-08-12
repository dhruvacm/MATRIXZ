import { Modal } from "./Modal";

export function ConfirmDialog({
  open,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
  danger = true,
}: {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} maxWidth="max-w-md">
      <p className="text-sm text-slate-400">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors ${
            danger ? "bg-rose-600 hover:bg-rose-500" : "bg-violet-deep hover:bg-violet-glow"
          }`}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
