import { Router } from "express";

import { requireAuth } from "../lib/auth";
import { notImplemented } from "../lib/http";

export const rewardsRouter = Router();

// GET  /api/rewards — all seeded rewards
rewardsRouter.get("/", requireAuth, notImplemented("GET /api/rewards", "Phase 5"));

// POST /api/rewards/:id/redeem — checks balance, deducts cost, creates redemptions/{id}, returns { code }
rewardsRouter.post("/:id/redeem", requireAuth, notImplemented("POST /api/rewards/:id/redeem", "Phase 5"));
