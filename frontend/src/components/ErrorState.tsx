import { AlertTriangle } from "lucide-react";

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-rose-200 bg-rose-50/40 px-8 py-14 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-rose-100 text-rose-600 shadow-subtle">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="font-display text-base font-bold text-[#202923]">Failed to Load Telemetry</h3>
      <p className="max-w-sm text-sm leading-relaxed text-[#48544B]">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-secondary mt-3">
          Retry Request
        </button>
      )}
    </div>
  );
}
