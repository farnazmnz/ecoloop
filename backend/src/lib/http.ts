import type { RequestHandler } from "express";

/** Placeholder handler for routes that are scaffolded but not yet built. */
export function notImplemented(label: string, phase: string): RequestHandler {
  return (_req, res) => {
    res.status(501).json({
      error: "Not implemented",
      route: label,
      phase,
      see: "docs/SPEC.md §7 and §10",
    });
  };
}
