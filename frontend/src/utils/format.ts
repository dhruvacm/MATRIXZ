export function formatDate(dateStr: string, opts: Intl.DateTimeFormatOptions = {}) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatDay(dateStr: string) {
  return new Date(dateStr).getDate().toString().padStart(2, "0");
}

export function formatMonth(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
}

export function isPastDeadline(dateStr?: string | null) {
  if (!dateStr) return false;
  return new Date(dateStr).getTime() < Date.now();
}
