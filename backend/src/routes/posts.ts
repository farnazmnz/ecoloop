import { Router } from "express";
import multer from "multer";

import { requireAuth } from "../lib/auth";
import { notImplemented } from "../lib/http";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

export const postsRouter = Router();

// GET  /api/posts?lat&lng&limit=50 — open posts sorted by haversine distance, each with distanceKm
postsRouter.get("/", requireAuth, notImplemented("GET /api/posts", "Phase 3"));

// POST /api/posts — multipart: image, title, description, category, condition, lat, lng, fromScanId?
// → uploads posts/{postId}.jpg (public), creates post, +5 points, streak
postsRouter.post("/", requireAuth, upload.single("image"), notImplemented("POST /api/posts", "Phase 3"));

// GET  /api/posts/:id — post + claims (claims only when requester is the owner)
postsRouter.get("/:id", requireAuth, notImplemented("GET /api/posts/:id", "Phase 3"));

// POST /api/posts/:id/claim — adds claims/{uid}, increments claimCount; owner cannot claim own post
postsRouter.post("/:id/claim", requireAuth, notImplemented("POST /api/posts/:id/claim", "Phase 3"));

// POST /api/posts/:id/pickup — multipart: image, claimerId. Owner only.
// → validates claimer + status open, uploads pickups/{postId}.jpg, sets picked_up,
//   +25 owner / +15 claimer in ONE transaction
postsRouter.post(
  "/:id/pickup",
  requireAuth,
  upload.single("image"),
  notImplemented("POST /api/posts/:id/pickup", "Phase 4"),
);
