// npm run seed — loads data/seed/*.json and writes demo content to Firestore.
import { readFileSync } from "node:fs";

import { config as loadEnv } from "dotenv";

loadEnv({ quiet: true });

const seedDir = new URL("../../data/seed/", import.meta.url);

function loadJson<T>(name: string): T {
  return JSON.parse(readFileSync(new URL(name, seedDir), "utf8")) as T;
}

async function main() {
  const posts = loadJson<unknown[]>("posts.json");
  const rewards = loadJson<unknown[]>("rewards.json");
  console.log(`Loaded ${posts.length} posts and ${rewards.length} rewards from data/seed/`);

  // TODO(Phase 6): per docs/SPEC.md §9
  //   - users/demo-user with 120 points and a 3-day streak
  //   - 8 posts spread across Unionville / Markham Village / Milliken / Cornell, 2 already picked_up
  //   - 6 rewards from fictional businesses
  //   Use db().batch() from ../src/lib/firebase.admin and make the script idempotent (set with fixed ids).
  console.log("TODO: Firestore writes not implemented yet (Phase 6).");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
