# ecoloop · ReMarkham

"Instagram for reducing waste" in Markham, Ontario. Scan an item → learn which Markham bin or depot
it belongs in → log it or give it away on a nearby-first marketplace → earn points → redeem them at
local businesses.

Built for the GDG Markham 24-hour civic-tech hackathon (waste-reduction track).
The full product spec, data model, API contract and build phases live in [docs/SPEC.md](docs/SPEC.md).

> **Verify rules against markham.ca "What Goes Where" before demo.**
> `data/markham_rules.json` currently holds a 10-item starter set; the spec calls for ~120.

## Repository layout

```
ecoloop/
├─ frontend/        Next.js 15 (App Router, TypeScript, Tailwind) — the mobile-first UI
├─ backend/         Express + TypeScript — Firebase Admin, Gemini, points. All writes happen here.
├─ python/          Data tooling — validate / draft the Markham disposal knowledge base
├─ data/            Shared data: markham_rules.json, depots.json, seed/*.json
└─ docs/            SPEC.md (the build spec)
```

The spec was written for a single Next.js app with `app/api` routes. This repo deliberately splits
UI and API so each can be deployed and worked on independently:

| Concern | Lives in |
|---|---|
| Screens, bottom nav, Firebase **client** auth | `frontend/src` |
| `/api/*` routes, Firebase **Admin** writes, Gemini `scan()`, points/streak rules | `backend/src` |
| `npm run seed` | `backend/scripts/seed.ts` |
| Rules / depots / seed JSON | `data/` |
| Rules validation and generation scripts | `python/scripts` |

## Prerequisites

- Node 20+ (tested on Node 24) and npm
- Python 3.11+ (only for `python/` tooling)
- A Firebase project with **Auth** (Google + Anonymous), **Firestore** and **Storage** enabled
- A Gemini API key

## Quick start

```powershell
# 1. Install everything (root + frontend + backend)
npm run install:all

# 2. Environment
Copy-Item frontend\.env.example frontend\.env.local
Copy-Item backend\.env.example  backend\.env
#    …then fill in the values (tables below)

# 3. Run both servers (frontend :3000, backend :4000)
npm run dev
```

Other root scripts:

| Script | What it does |
|---|---|
| `npm run dev:frontend` / `npm run dev:backend` | Run one side only |
| `npm run seed` | Seed demo posts, rewards and a demo user (Phase 6) |
| `npm run build` | Next.js production build + backend typecheck |
| `npm run lint` | Frontend ESLint + backend typecheck |

Python tooling is separate — see [python/README.md](python/README.md).

## Environment variables

### `frontend/.env.local`

| Var | Notes |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend base URL, e.g. `http://localhost:4000` |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | From Firebase console → Project settings → Web app |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | |
| `NEXT_PUBLIC_DEFAULT_LAT` | `43.8561` — Markham Civic Centre fallback when geolocation is denied |
| `NEXT_PUBLIC_DEFAULT_LNG` | `-79.3370` |

### `backend/.env`

| Var | Notes |
|---|---|
| `PORT` | Default `4000` |
| `CORS_ORIGIN` | Comma-separated allowed origins, default `http://localhost:3000` |
| `GEMINI_API_KEY` | |
| `GEMINI_MODEL` | Default `gemini-2.5-flash` |
| `FIREBASE_SERVICE_ACCOUNT_BASE64` | base64 of the service-account JSON (see `.env.example` for the one-liner) |
| `FIREBASE_STORAGE_BUCKET` | Bucket name from Firebase console → Storage |
| `RULES_PATH` | Optional override; defaults to `../data/markham_rules.json` |

## Status

Scaffold only. Every API route returns `501 Not implemented` with the phase that builds it, and
the frontend has the tab layout and placeholder pages. Build order and acceptance checks are in
[docs/SPEC.md §10](docs/SPEC.md).

| Phase | Scope | Status |
|---|---|---|
| 0 | Scaffold, auth, bottom nav, `/api/me` | scaffolded (auth + `/api/me` TODO) |
| 1 | Gemini scan + rules KB | TODO |
| 2 | Logging, points, streak, stats | TODO |
| 3 | Marketplace feed, create post, claim | TODO |
| 4 | Pickup confirmation | TODO |
| 5 | Rewards + redeem codes | TODO |
| 6 | Seed, polish, deploy | TODO |

## Deploy

- **frontend/** → Vercel (set the `NEXT_PUBLIC_*` vars; point `NEXT_PUBLIC_API_URL` at the backend)
- **backend/** → any Node host (Render, Railway, Cloud Run). Set `CORS_ORIGIN` to the Vercel URL.
