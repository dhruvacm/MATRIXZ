export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="spinner-container flex flex-col items-center justify-center gap-3 py-16 text-[#6E7A71]">
      <div className="relative h-9 w-9">
        <div className="absolute inset-0 rounded-full border-2 border-[#E1E4DC]" />
        <div className="spinner-ring absolute inset-0 rounded-full border-2 border-transparent border-t-violet-glow animate-spin" />
      </div>
      <p className="font-mono text-xs">{label}...</p>
    </div>
  );
}
