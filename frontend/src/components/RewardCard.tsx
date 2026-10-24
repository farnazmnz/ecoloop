import { Button } from "@/components/ui/Button";
import { formatPoints } from "@/lib/format";
import type { Reward } from "@/lib/types";

export function RewardCard({
  reward,
  balance,
  onRedeem,
}: {
  reward: Reward;
  balance: number;
  onRedeem: (reward: Reward) => void;
}) {
  const affordable = balance >= reward.cost;
  const missing = reward.cost - balance;

  return (
    <article className="flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center gap-4 border-b border-stone-100 bg-gradient-to-br from-stone-50 to-emerald-50/60 p-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm" aria-hidden="true">
          {reward.emoji}
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-stone-500">{reward.businessName}</p>
          <h3 className="text-lg font-bold leading-tight text-stone-900">{reward.title}</h3>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm text-stone-600">{reward.description}</p>
        <p className="text-xs text-stone-400">{reward.address}</p>
        <div className="mt-auto flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-800">
            🌱 {formatPoints(reward.cost)} pts
          </span>
          <Button variant={affordable ? "primary" : "outline"} disabled={!affordable} onClick={() => onRedeem(reward)}>
            {affordable ? "Redeem" : `${formatPoints(missing)} more`}
          </Button>
        </div>
      </div>
    </article>
  );
}
