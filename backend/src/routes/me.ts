import { Router } from "express";

import { requireAuth } from "../lib/auth";
import { notImplemented } from "../lib/http";

export const meRouter = Router();

// GET  /api/me — user doc (create on first call with 0 points)
meRouter.get("/", requireAuth, notImplemented("GET /api/me", "Phase 0"));

// POST /api/me/location — body: { lat, lng }
meRouter.post("/location", requireAuth, notImplemented("POST /api/me/location", "Phase 0"));

// GET  /api/me/stats — dashboard stats from logs + posts (docs/SPEC.md §5)
meRouter.get("/stats", requireAuth, notImplemented("GET /api/me/stats", "Phase 2"));

// GET  /api/me/posts — my posts, all statuses
meRouter.get("/posts", requireAuth, notImplemented("GET /api/me/posts", "Phase 3"));

// GET  /api/me/logs — my last 50 logs
meRouter.get("/logs", requireAuth, notImplemented("GET /api/me/logs", "Phase 2"));
