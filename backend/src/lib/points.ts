// Single source of truth for points, streaks and targets (docs/SPEC.md §5).
// Every point change must write users.points AND a pointsLedger doc in ONE Firestore transaction.

import type { PointsReason, Stream } from "../types";

export const POINTS = {
  log_diverted: 5,
  log_garbage: 1,
  post_created: 5,
  pickup_giver: 25,
  pickup_receiver: 15,
  streak_7: 20,
} as const satisfies Record<Exclude<PointsReason, "redeem">, number>;

/** Streak bonus fires every N consecutive days. */
export const STREAK_BONUS_EVERY = 7;

/** City of Markham residential diversion target shown on the dashboard. */
export const MARKHAM_DIVERSION_TARGET = 0.8;

export const TIMEZONE = "America/Toronto";

/** A logged item counts as "diverted" when it does not go to garbage. */
export function isDiverted(stream: Stream): boolean {
  return stream !== "garbage";
}

export function pointsForLog(stream: Stream): { delta: number; reason: PointsReason } {
  return isDiverted(stream)
    ? { delta: POINTS.log_diverted, reason: "log_diverted" }
    : { delta: POINTS.log_garbage, reason: "log_garbage" };
}

/** "YYYY-MM-DD" in America/Toronto. `en-CA` formats dates exactly that way. */
export function todayInToronto(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d + days);
  return new Date(t).toISOString().slice(0, 10);
}

/**
 * Streak rule: same day → unchanged; yesterday → +1; anything else → reset to 1.
 * Returns the new streak and whether the 7-day bonus should be awarded for this update.
 */
export function nextStreak(
  lastActiveDate: string | undefined,
  streakCount: number,
  today: string = todayInToronto(),
): { streakCount: number; lastActiveDate: string; changed: boolean; bonus: boolean } {
  if (lastActiveDate === today) {
    return { streakCount, lastActiveDate: today, changed: false, bonus: false };
  }
  const next = lastActiveDate === addDays(today, -1) ? streakCount + 1 : 1;
  return {
    streakCount: next,
    lastActiveDate: today,
    changed: true,
    bonus: next > 0 && next % STREAK_BONUS_EVERY === 0,
  };
}

// TODO(Phase 2): awardPoints(tx, uid, delta, reason, refId) — reads users/{uid}, bumps points,
// writes pointsLedger/{autoId}, all inside the caller's Firestore transaction.
