"""Draft data/markham_rules.json with Gemini for human review.

TODO(Phase 1): implement.
    1. Load GEMINI_API_KEY from python/.env (python-dotenv).
    2. Prompt gemini (model from GEMINI_MODEL, default gemini-2.5-flash) for ~120 common household
       items using the schema in docs/SPEC.md §6, response_mime_type="application/json".
       Must include the Markham specifics: clean Styrofoam → recycling_depot (NOT blue_box);
       batteries/paint/chemicals/small electronics → hazardous_depot; textiles in any condition →
       textile_bin (wearable clothing also reusable=true); tires → retailer_takeback;
       scrap metal → recycling_depot; multi-part items (coffee cup = cup / lid / sleeve) as separate entries.
    3. Validate with scripts/validate_rules.py models, then write to data/markham_rules.json.
    4. A human verifies against markham.ca "What Goes Where" before demo.

Usage (once implemented):
    python scripts/generate_rules.py --out ../data/markham_rules.json
"""

from __future__ import annotations

import sys


def main() -> int:
    print("generate_rules.py is not implemented yet - see the TODO in this file and docs/SPEC.md section 6.")
    return 2


if __name__ == "__main__":
    sys.exit(main())
