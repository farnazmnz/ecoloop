"use client";

import { useMemo, useState } from "react";

import { PageHeader } from "@/components/AppShell";
import { RewardCard } from "@/components/RewardCard";
import { ClipboardIcon, GiftIcon } from "@/components/icons";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatDate, formatPoints } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Reward } from "@/lib/types";

export default function RewardsPage() {
  const toast = useToast();
  const { state, currentUser, redeem } = useStore();
  const [pending, setPending] = useState<Reward | null>(null);
  const [issued, setIssued] = useState<{ reward: Reward; code: string } | null>(null);

  const balance = currentUser?.points ?? 0;
  const myRedemptions = useMemo(
    () => (currentUser ? state.redemptions.filter((r) => r.userId === currentUser.id) : []),
    [state.redemptions, currentUser],
  );
  const rewardById = (id: string) => state.rewards.find((r) => r.id === id);

  const confirm = () => {
    if (!pending) return;
    const r = redeem(pending.id);
    if (!r.ok || !r.code) {
      toast.error("Couldn't redeem", r.error);
      return;
    }
    setIssued({ reward: pending, code: r.code });
    setPending(null);
    toast.points(-pending.cost, `${pending.title} at ${pending.businessName}`);
  };

  const copy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied");
    } catch {
      toast.error("Couldn't copy", "Long-press the code to copy it.");
    }
  };

  return (
    <>
      <PageHeader title="Rewards" subtitle="Redeem your points at local Markham businesses." back={{ href: "/profile", label: "Profile" }} />

      <div className="mb-6 flex items-center justify-between gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-4 sm:p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Your balance</p>
          <p className="text-3xl font-extrabold text-emerald-900">
            {formatPoints(balance)} <span className="text-base font-semibold text-emerald-700">pts</span>
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
          <GiftIcon size={24} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {state.rewards.map((reward) => (
          <RewardCard key={reward.id} reward={reward} balance={balance} onRedeem={setPending} />
        ))}
      </div>

      {myRedemptions.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-3 text-lg font-bold text-stone-900">My redemptions</h2>
          <ul className="divide-y divide-stone-100 overflow-hidden rounded-3xl border border-stone-200 bg-white">
            {myRedemptions.map((r) => {
              const reward = rewardById(r.rewardId);
              return (
                <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-2xl" aria-hidden="true">
                    {reward?.emoji ?? "🎁"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-stone-900">{reward?.title ?? "Reward"}</p>
                    <p className="truncate text-xs text-stone-500">
                      {reward?.businessName} · {formatDate(r.createdAt)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copy(r.code)}
                    className="rounded-lg bg-stone-100 px-2.5 py-1 font-mono text-sm font-bold tracking-widest text-stone-800 hover:bg-stone-200"
                  >
                    {r.code}
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Confirm */}
      <Modal
        open={!!pending}
        onClose={() => setPending(null)}
        title={pending ? `Redeem ${pending.title}?` : ""}
        description={pending ? `${pending.businessName} · ${pending.address}` : undefined}
        footer={
          <>
            <Button variant="ghost" onClick={() => setPending(null)}>
              Cancel
            </Button>
            <Button onClick={confirm}>Redeem for {pending ? formatPoints(pending.cost) : ""} pts</Button>
          </>
        }
      >
        {pending && (
          <div className="rounded-2xl bg-stone-50 p-4 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Your balance</span>
              <span className="font-semibold">{formatPoints(balance)} pts</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-stone-500">Cost</span>
              <span className="font-semibold text-rose-600">−{formatPoints(pending.cost)} pts</span>
            </div>
            <div className="mt-1 flex justify-between border-t border-stone-200 pt-2">
              <span className="font-semibold text-stone-700">After</span>
              <span className="font-bold text-emerald-700">{formatPoints(balance - pending.cost)} pts</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Code */}
      <Modal open={!!issued} onClose={() => setIssued(null)} footer={<Button onClick={() => setIssued(null)}>Done</Button>}>
        {issued && (
          <div className="py-2 text-center animate-pop">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl" aria-hidden="true">
              {issued.reward.emoji}
            </div>
            <h2 className="mt-4 text-xl font-extrabold text-stone-900">{issued.reward.title}</h2>
            <p className="text-sm text-stone-500">{issued.reward.businessName}</p>
            <div className="mx-auto mt-5 w-fit rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 px-6 py-4">
              <p className="font-mono text-3xl font-extrabold tracking-[0.3em] text-emerald-900">{issued.code}</p>
            </div>
            <p className="mt-3 text-sm font-medium text-stone-700">Show this at the counter.</p>
            <Button variant="ghost" size="sm" className="mt-2" leftIcon={<ClipboardIcon size={16} />} onClick={() => copy(issued.code)}>
              Copy code
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
