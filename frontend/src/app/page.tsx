"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LeafIcon } from "@/components/icons";
import { useStore } from "@/lib/store";

export default function Home() {
  const { hydrated, currentUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (!hydrated) return;
    router.replace(currentUser ? "/feed" : "/login");
  }, [hydrated, currentUser, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-stone-50">
      <div className="flex items-center gap-3 animate-fade-in">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30">
          <LeafIcon size={26} />
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-stone-900">ReMarkham</span>
      </div>
    </div>
  );
}
