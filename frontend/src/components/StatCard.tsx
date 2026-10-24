import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = false,
  progress,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  accent?: boolean;
  progress?: { value: number; target?: number }; // 0–1
}) {
  return (
    <div
      className={`flex flex-col gap-1 rounded-2xl border p-4 ${
        accent ? "border-emerald-200 bg-emerald-50" : "border-stone-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2 text-xs font-semibold uppercase tracking-wide text-stone-500">
        <span>{label}</span>
        {icon && <span className="text-stone-400">{icon}</span>}
      </div>
      <div className="text-2xl font-extrabold tracking-tight text-stone-900 sm:text-3xl">{value}</div>
      {progress && (
        <div className="relative mt-1 h-2 overflow-hidden rounded-full bg-stone-200" aria-hidden="true">
          <div
            className="h-full rounded-full bg-emerald-600 transition-all"
            style={{ width: `${Math.min(100, Math.round(progress.value * 100))}%` }}
          />
          {progress.target !== undefined && (
            <div
              className="absolute top-0 h-full w-0.5 bg-stone-700"
              style={{ left: `${Math.round(progress.target * 100)}%` }}
            />
          )}
        </div>
      )}
      {sub && <div className="text-xs text-stone-500">{sub}</div>}
    </div>
  );
}
