import type { NextFunction, Request, Response } from "express";

import { adminAuth } from "./firebase.admin";

/** Request after `requireAuth` has run — `uid` always comes from the verified token. */
export type AuthedRequest = Request & { uid: string };

/**
 * Reads `Authorization: Bearer <Firebase ID token>`, verifies it with the Admin SDK and
 * attaches `req.uid`. Never trust a userId from the body or query (docs/SPEC.md §3).
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice("Bearer ".length).trim() : "";

  if (!token) {
    res.status(401).json({ error: "Missing Authorization: Bearer <idToken> header" });
    return;
  }

  try {
    const decoded = await adminAuth().verifyIdToken(token);
    (req as AuthedRequest).uid = decoded.uid;
    next();
  } catch (err) {
    console.warn("verifyIdToken failed:", err instanceof Error ? err.message : err);
    res.status(401).json({ error: "Invalid or expired ID token" });
  }
}

export function uidOf(req: Request): string {
  const uid = (req as AuthedRequest).uid;
  if (!uid) throw new Error("uidOf() called on a request that did not pass requireAuth");
  return uid;
}
