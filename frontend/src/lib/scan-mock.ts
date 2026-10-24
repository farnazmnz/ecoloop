// Demo-mode item identification. Matches the user's hint against data/markham_rules.json so the
// scan flow is fully usable before Gemini is wired up (backend Phase 1). When the backend is live,
// POST /api/scan replaces `mockScan`; `searchRules` stays as the "help us identify" fallback.

import depotsJson from "../../../data/depots.json";
import rulesJson from "../../../data/markham_rules.json";

import { STREAM_META, type DisposalRule, type ScanItem, type ScanResult, type Stream } from "./types";

export const RULES = rulesJson as DisposalRule[];

type Depot = { id: string; name: string; type: string; address: string; accepts: string[]; mapsUrl: string };
export const DEPOTS = depotsJson as { mapsUrl: string; depots: Depot[] };

export const SCAN_MESSAGES = [
  "Identifying the item…",
  "Checking Markham's What Goes Where rules…",
  "Estimating weight and reuse potential…",
];

/** Items that are really several parts, each sorted separately (docs/SPEC.md §6). */
const COMPOSITES: Array<{ keys: string[]; items: string[] }> = [
  {
    keys: ["coffee cup", "takeout coffee", "tim hortons cup", "starbucks cup", "hot drink"],
    items: ["Paper coffee cup", "Coffee cup lid (plastic)", "Coffee cup sleeve (cardboard)"],
  },
  {
    keys: ["takeout container", "take-out container", "food container"],
    items: ["Plastic takeout container", "Napkin (used)"],
  },
  {
    keys: ["pizza box"],
    items: ["Pizza box (clean parts)", "Pizza box (greasy parts)"],
  },
  {
    keys: ["water bottle", "plastic bottle"],
    items: ["Plastic water bottle", "Bottle cap (plastic)"],
  },
];

const MATERIAL_BY_STREAM: Record<Stream, string> = {
  blue_box: "Recyclable packaging",
  green_bin: "Organic material",
  garbage: "Non-recyclable",
  textile_bin: "Textile",
  recycling_depot: "Depot-only recyclable",
  hazardous_depot: "Hazardous / e-waste",
  yard_waste: "Yard waste",
  bulky_pickup: "Bulky item",
  retailer_takeback: "Retailer take-back",
};

function tokens(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t));
}
const STOP = new Set(["a", "an", "the", "my", "old", "some", "of", "and", "or", "with", "this", "is", "it"]);

export function scoreRule(rule: DisposalRule, query: string): number {
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  const names = [rule.item, ...rule.aliases].map((n) => n.toLowerCase());
  let score = 0;
  for (const n of names) {
    if (n === q) score = Math.max(score, 100);
    else if (q.includes(n) || n.includes(q)) score = Math.max(score, 70 + Math.min(20, n.length));
  }
  const qt = tokens(q);
  const nt = new Set(names.flatMap(tokens));
  let overlap = 0;
  for (const t of qt) {
    if (nt.has(t)) overlap += 12;
    else if ([...nt].some((n) => n.startsWith(t) || t.startsWith(n))) overlap += 5;
  }
  return score + overlap;
}

export function searchRules(query: string, limit = 8): Array<{ rule: DisposalRule; score: number }> {
  const scored = RULES.map((rule) => ({ rule, score: scoreRule(rule, query) })).filter((r) => r.score > 0);
  scored.sort((a, b) => b.score - a.score || a.rule.item.localeCompare(b.rule.item));
  return scored.slice(0, limit);
}

export function findRule(item: string): DisposalRule | undefined {
  const key = item.toLowerCase();
  return RULES.find((r) => r.item.toLowerCase() === key);
}

export function ruleToScanItem(rule: DisposalRule, confidence: number): ScanItem {
  return {
    name: rule.item,
    material: MATERIAL_BY_STREAM[rule.stream],
    stream: rule.stream,
    binLabel: STREAM_META[rule.stream].label,
    instructions: rule.instructions,
    reusable: rule.reusable,
    reuseSuggestion: rule.reuse_suggestion,
    estWeightG: rule.est_weight_g,
    confidence,
  };
}

export function buildScanResult(rules: DisposalRule[], confidence = 0.92): ScanResult {
  const items = rules.map((r) => ruleToScanItem(r, confidence));
  const first = rules[0]?.item.toLowerCase() ?? "item";
  const summary =
    rules.length <= 1
      ? `Looks like a ${first}.`
      : `Looks like a ${first} — it has ${rules.length} parts that are sorted separately.`;
  return { summary, items, overallReusable: items.some((i) => i.reusable) };
}

/**
 * Returns a ScanResult when the hint clearly matches a rule, otherwise null so the UI can ask the
 * user to pick from `searchRules()` suggestions.
 */
export function mockScan(hint: string): ScanResult | null {
  const q = hint.trim().toLowerCase();
  if (!q) return null;

  for (const c of COMPOSITES) {
    if (c.keys.some((k) => q.includes(k))) {
      const rules = c.items.map(findRule).filter((r): r is DisposalRule => Boolean(r));
      if (rules.length) return buildScanResult(rules, 0.9);
    }
  }

  const [top, second] = searchRules(q, 2);
  if (!top) return null;
  if (top.score >= 70) return buildScanResult([top.rule], 0.93);
  if (top.score >= 24 && (!second || top.score - second.score >= 10)) return buildScanResult([top.rule], 0.74);
  return null;
}

export function depotFor(stream: Stream): Depot | undefined {
  if (!STREAM_META[stream].isDepot) return undefined;
  return DEPOTS.depots.find((d) => d.type === stream) ?? DEPOTS.depots[0];
}
