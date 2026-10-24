import { STREAM_META, type Stream } from "@/lib/types";

export function StreamPill({ stream, size = "md" }: { stream: Stream; size?: "sm" | "md" | "lg" }) {
  const meta = STREAM_META[stream];
  const sizes = {
    sm: "h-6 px-2.5 text-xs gap-1",
    md: "h-8 px-3 text-sm gap-1.5",
    lg: "h-10 px-4 text-base gap-2",
  };
  return (
    <span className={`inline-flex items-center rounded-full font-bold ring-1 ring-inset ${meta.pill} ${sizes[size]}`}>
      <span className={`inline-block h-2 w-2 rounded-full ${meta.dot}`} aria-hidden="true" />
      {meta.label}
    </span>
  );
}
