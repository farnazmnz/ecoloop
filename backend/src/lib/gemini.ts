import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { GoogleGenAI } from "@google/genai";

import type { DisposalRule, ScanResult } from "../types";

export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export const SYSTEM_INSTRUCTION =
  "You are a waste-sorting assistant for the City of Markham, Ontario. " +
  "Use ONLY the rules below to decide where items go. " +
  "If an item is not in the rules, infer from the closest material match and set confidence lower.";

const DEFAULT_RULES_PATH = fileURLToPath(new URL("../../../data/markham_rules.json", import.meta.url));

/** Loads data/markham_rules.json (override with RULES_PATH). Small enough to inline in the prompt. */
export function loadRules(): DisposalRule[] {
  const path = process.env.RULES_PATH || DEFAULT_RULES_PATH;
  return JSON.parse(readFileSync(path, "utf8")) as DisposalRule[];
}

let client: GoogleGenAI | null = null;
export function gemini(): GoogleGenAI {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set — see backend/.env.example");
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

export type ScanImage = { base64: string; mimeType: string };

/**
 * Identify the item(s) in a photo and map each to a Markham disposal stream.
 *
 * TODO(Phase 1): implement per docs/SPEC.md §6
 *   1. contents = [{ inlineData: { data: image.base64, mimeType } }, { text: hint ?? "" }]
 *   2. config = { systemInstruction: SYSTEM_INSTRUCTION + "\n\nRULES:\n" + JSON.stringify(loadRules()),
 *                 responseMimeType: "application/json", responseSchema: <ScanResult schema> }
 *   3. gemini().models.generateContent({ model: GEMINI_MODEL, contents, config })
 *   4. Validate with zod; retry once on failure; throw a friendly error on the second failure.
 */
export async function scan(_image: ScanImage, _hint?: string): Promise<ScanResult> {
  throw new Error("scan() is not implemented yet — Phase 1 in docs/SPEC.md");
}
