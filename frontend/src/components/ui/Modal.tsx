"use client";

import { useEffect, type ReactNode } from "react";

import { XIcon } from "@/components/icons";

/** Bottom sheet on phones, centred dialog on larger screens. */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true">
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-stone-900/50 backdrop-blur-[2px] animate-fade-in" />
      <div className="relative w-full max-w-lg rounded-t-3xl bg-white shadow-2xl animate-slide-up sm:rounded-3xl">
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-stone-200 sm:hidden" />
        <div className="flex items-start justify-between gap-4 px-5 pt-4 sm:px-6 sm:pt-6">
          <div>
            {title && <h2 className="text-lg font-bold text-stone-900">{title}</h2>}
            {description && <p className="mt-1 text-sm text-stone-500">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-1 rounded-full p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-800"
          >
            <XIcon />
          </button>
        </div>
        <div className="px-5 py-4 sm:px-6">{children}</div>
        {footer && <div className="flex flex-col-reverse gap-2 border-t border-stone-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6 safe-bottom">{footer}</div>}
      </div>
    </div>
  );
}
