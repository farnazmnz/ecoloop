import { Router } from "express";

import { requireAuth } from "../lib/auth";
import { notImplemented } from "../lib/http";

export const logsRouter = Router();

// POST /api/logs  — body: { scanId, itemIndex }
// → creates logs/{id}, awards points (lib/points), updates streak — one transaction
logsRouter.post("/", requireAuth, notImplemented("POST /api/logs", "Phase 2"));
