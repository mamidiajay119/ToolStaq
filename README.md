# AI Directory Web

A Next.js 16 app that serves a curated directory of 2,688+ AI tools with filtering, search, comparison, and individual tool pages.

## Getting Started

```bash
npm run dev       # start dev server at localhost:3000
npm run build     # production build
npm run lint      # run ESLint
```

## Data Pipeline

The tool data lives in `public/data/tools.json`. It is generated from the companion
**`ai_directory`** Python project (`/Users/ajay/ai_directory/`). Run the steps below
in order whenever you have new or updated tool data.

### Step 1 — Generate master file
```bash
cd /Users/ajay/ai_directory
python generate_master_file.py
# Input:  /Users/ajay/Documents/ai_tools_enriched_full.xlsx
# Output: /Users/ajay/Documents/ai_tool_master.xlsx
```

### Step 2 — Enrich scraped data
```bash
python enrich_master_file.py
# Re-scrapes title, description, features, integrations, pricing
# Input/Output: /Users/ajay/Documents/ai_tool_master.xlsx
```

### Step 3 — Convert to JSON
```bash
python convert_to_json.py
# Converts Excel → public/data/tools.json
# ⚡ Automatically preserves existing long_descriptions so AI-generated
#    text is never lost on re-runs.
```

### Step 4 — Generate AI descriptions  *(run once, or for new tools only)*
```bash
OPENAI_API_KEY=sk-... python generate_long_descriptions.py
# Writes a "What is X?" long_description for every tool using gpt-4o-mini.
# Skips tools that already have a long_description (idempotent).
# Input/Output: public/data/tools.json
```

**To re-generate descriptions for new tools only:**
```bash
# Step 3 writes "" for new tools and preserves existing ones.
# Step 4 automatically skips tools that already have a long_description.
OPENAI_API_KEY=sk-... python generate_long_descriptions.py
```

**To force-regenerate all descriptions:**
```bash
OPENAI_API_KEY=sk-... FORCE=1 python generate_long_descriptions.py
```

**To resume after an interruption:**
```bash
OPENAI_API_KEY=sk-... START_FROM_SLUG=looka python generate_long_descriptions.py
```

### Pipeline options (env vars for Step 4)
| Variable | Default | Description |
|---|---|---|
| `OPENAI_API_KEY` | — | **Required** |
| `MODEL` | `gpt-4o-mini` | OpenAI model |
| `CONCURRENCY` | `8` | Parallel requests |
| `BATCH_SIZE` | `50` | Tools saved per checkpoint |
| `START_FROM_SLUG` | — | Resume from slug |
| `FORCE` | `0` | Set to `1` to regenerate all |

## Project Structure

```
src/
  app/              # Next.js App Router pages
    tools/          # /tools listing + /tools/[slug] detail
    categories/     # /categories listing
    category/       # /category/[slug] filtered listing
    compare/        # /compare side-by-side tool comparison
  components/       # Shared UI components
  lib/tools.ts      # Data access layer (reads tools.json)
  types/tool.ts     # TypeScript types
public/
  data/tools.json   # Master tool database (generated — do not edit manually)
scripts/
  enrich-descriptions.ts   # Node.js version of Step 4 (alternative to Python)
```
