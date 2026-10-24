# python/ — data tooling

Offline helpers for the shared `data/` folder. Nothing here runs in production; the app itself is
`frontend/` (Next.js) + `backend/` (Express).

| Script | Purpose |
|---|---|
| `scripts/validate_rules.py` | Validates `data/markham_rules.json` against the schema in `docs/SPEC.md` §6 and prints a per-stream breakdown. Run before every demo. |
| `scripts/generate_rules.py` | **TODO** — drafts the ~120-item knowledge base with Gemini, for a human to review and commit. |

## Setup

```powershell
cd python
python -m venv .venv
.\.venv\Scripts\Activate.ps1      # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
```

## Run

```powershell
python scripts/validate_rules.py                 # validates ../data/markham_rules.json
python scripts/validate_rules.py path\to\other.json
```

`generate_rules.py` needs `GEMINI_API_KEY` in `python/.env` (copy `.env.example`).

> Verify rules against markham.ca "What Goes Where" before demo.
