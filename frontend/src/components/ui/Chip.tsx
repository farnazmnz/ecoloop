import type { ReactNode } from "react";

export type ChipTone = "stone" | "emerald" | "sky" | "violet" | "orange" | "amber" | "rose" | "white";

const TONES: Record<ChipTone, string> = {
  stone: "bg-stone-100 text-stone-700",
  emerald: "bg-emerald-100 text-emerald-800",
  sky: "bg-sky-100 text-sky-800",
  violet: "bg-violet-100 text-violet-800",
  orange: "bg-orange-100 text-orange-800",
  amber: "bg-amber-100 text-amber-800",
  rose: "bg-rose-100 text-rose-800",
  white: "bg-white/90 text-stone-800 shadow-sm backdrop-blur",
};

export function Chip({
  tone = "stone",
  size = "sm",
  className = "",
  children,
}: {
  tone?: ChipTone;
  size?: "xs" | "sm" | "md";
  className?: string;
  children: ReactNode;
}) {
  const sizes = { xs: "h-5 px-2 text-[11px]", sm: "h-6 px-2.5 text-xs", md: "h-8 px-3 text-sm" };
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full font-medium leading-none ${TONES[tone]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}

export function FilterChip({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition ${
        selected
          ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
          : "border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50"
      }`}
    >
      {children}
    </button>
  );
}
