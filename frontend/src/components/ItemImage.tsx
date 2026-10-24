"use client";

import { useState } from "react";

import { CATEGORY_META, type Category } from "@/lib/types";

/** <img> with a tasteful category fallback if the photo fails to load (offline demos, dead URLs). */
export function ItemImage({
  src,
  alt,
  category = "other",
  className = "",
  imgClassName = "",
  loading = "lazy",
}: {
  src?: string;
  alt: string;
  category?: Category;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}) {
  const [failed, setFailed] = useState(false);
  const meta = CATEGORY_META[category];

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br ${meta.gradient} ${className}`}
      >
        <span className="text-5xl drop-shadow-sm" aria-hidden="true">
          {meta.emoji}
        </span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden bg-stone-100 ${className}`}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
