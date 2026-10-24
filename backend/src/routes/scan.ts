import { Router } from "express";
import multer from "multer";

import { requireAuth } from "../lib/auth";
import { notImplemented } from "../lib/http";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const scanRouter = Router();

// POST /api/scan  — multipart: image (required), hint (optional)
// → calls lib/gemini.scan(), saves scans/{id}, returns { scanId, result }
scanRouter.post("/", requireAuth, upload.single("image"), notImplemented("POST /api/scan", "Phase 1"));
