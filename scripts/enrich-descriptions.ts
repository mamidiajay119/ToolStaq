/**
 * enrich-descriptions.ts
 *
 * Generates a rich `long_description` field for every tool in tools.json
 * using OpenAI's chat completion API.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-... npx ts-node scripts/enrich-descriptions.ts
 *
 * Options (env vars):
 *   START_FROM_SLUG  - resume from a specific slug (skip already processed tools)
 *   BATCH_SIZE       - tools processed before writing to disk (default: 50)
 *   CONCURRENCY      - parallel API requests (default: 5)
 *   MODEL            - OpenAI model to use (default: gpt-4o-mini)
 */

import fs from 'fs';
import path from 'path';

// ─── Config ─────────────────────────────────────────────────────────────────
const TOOLS_JSON_PATH = path.resolve(__dirname, '../public/data/tools.json');
const API_KEY         = process.env.OPENAI_API_KEY ?? '';
const BATCH_SIZE      = parseInt(process.env.BATCH_SIZE ?? '50', 10);
const CONCURRENCY     = parseInt(process.env.CONCURRENCY ?? '5', 10);
const MODEL           = process.env.MODEL ?? 'gpt-4o-mini';
const START_FROM      = process.env.START_FROM_SLUG ?? '';

if (!API_KEY) {
  console.error('❌  Missing OPENAI_API_KEY environment variable.');
  process.exit(1);
}

// ─── Types ───────────────────────────────────────────────────────────────────
interface Tool {
  slug: string;
  tool_name: string;
  url: string;
  category: string[];
  primary_category: string;
  title: string;
  description: string;
  best_for: string[];
  not_suitable_for: string[];
  core_features: string[];
  target_user_persona: string[];
  integrations: string[];
  pricing_model: string;
  deployment: string;
  has_api: boolean;
  free_trial: boolean;
  open_source: boolean;
  long_description?: string;
  [key: string]: unknown;
}

interface ToolsJson {
  meta: Record<string, unknown>;
  category_counts: Record<string, number>;
  tools: Tool[];
}

// ─── Prompt builder ──────────────────────────────────────────────────────────
function buildPrompt(tool: Tool): string {
  const features  = tool.core_features.length ? tool.core_features.slice(0, 4).join(', ') : '';
  const bestFor   = tool.best_for.slice(0, 3).join(', ');
  const notFor    = tool.not_suitable_for.slice(0, 2).join(', ');
  const users     = tool.target_user_persona.slice(0, 3).join(', ');

  return `You are writing a concise, informative overview paragraph for an AI tools directory.

Write a 3–4 sentence "What is ${tool.tool_name}?" description for the tool below.
- Start directly with "${tool.tool_name} is ..." (do NOT use a heading or label).
- Explain what it does, who it's for, and what makes it stand out.
- Use plain, jargon-free language.
- Do NOT pad with filler phrases or repeat the same info twice.
- Do NOT start with "Introducing" or "In today's world".

Tool context:
  Name: ${tool.tool_name}
  URL: ${tool.url}
  Categories: ${tool.category.join(', ')}
  Title/tagline: ${tool.title || 'N/A'}
  Description: ${tool.description || 'N/A'}
  Best for: ${bestFor || 'N/A'}
  Core features: ${features || 'N/A'}
  Target users: ${users || 'N/A'}
  Not suitable for: ${notFor || 'N/A'}
  Pricing: ${tool.pricing_model}, Free trial: ${tool.free_trial}, Open source: ${tool.open_source}`;
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────
async function fetchDescription(tool: Tool): Promise<string> {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.6,
      max_tokens: 250,
      messages: [
        { role: 'system', content: 'You write concise, factual product descriptions for an AI tools directory.' },
        { role: 'user', content: buildPrompt(tool) },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error for ${tool.slug}: ${res.status} ${err}`);
  }

  const json = await res.json() as { choices: Array<{ message: { content: string } }> };
  return json.choices[0].message.content.trim();
}

// ─── Concurrency helper ───────────────────────────────────────────────────────
async function pMap<T, R>(
  items: T[],
  fn: (item: T, idx: number) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = Array(items.length);
  let nextIdx = 0;

  async function worker() {
    while (nextIdx < items.length) {
      const idx = nextIdx++;
      results[idx] = await fn(items[idx], idx);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(`📖  Loading ${TOOLS_JSON_PATH} …`);
  const raw = fs.readFileSync(TOOLS_JSON_PATH, 'utf-8');
  const data = JSON.parse(raw) as ToolsJson;

  const tools = data.tools;
  const total = tools.length;

  // Resume support — skip already-enriched tools (or skip up to START_FROM_SLUG)
  let startIdx = 0;
  if (START_FROM) {
    startIdx = tools.findIndex((t) => t.slug === START_FROM);
    if (startIdx === -1) { console.warn(`⚠️  START_FROM_SLUG "${START_FROM}" not found, starting from 0`); startIdx = 0; }
    else console.log(`⏭️  Resuming from index ${startIdx} (slug: "${START_FROM}")`);
  }

  // Also skip any tool that already has a non-empty long_description
  const toProcess = tools
    .map((t, i) => ({ tool: t, idx: i }))
    .filter(({ tool, idx }) => idx >= startIdx && !tool.long_description?.trim());

  console.log(`\n🔄  ${toProcess.length} tools to enrich (${total - toProcess.length} already done)`);
  console.log(`    Model: ${MODEL}  |  Concurrency: ${CONCURRENCY}  |  Batch size: ${BATCH_SIZE}\n`);

  let processed = 0;
  let errors    = 0;

  // Process in batches so we save progress regularly
  for (let b = 0; b < toProcess.length; b += BATCH_SIZE) {
    const batch = toProcess.slice(b, b + BATCH_SIZE);

    await pMap(batch, async ({ tool, idx }) => {
      try {
        const desc = await fetchDescription(tool);
        data.tools[idx].long_description = desc;
        processed++;
        const pct = (((b + processed) / toProcess.length) * 100).toFixed(1);
        console.log(`  ✅  [${b + processed}/${toProcess.length}] (${pct}%) ${tool.tool_name}`);
      } catch (e) {
        errors++;
        console.error(`  ❌  ${tool.tool_name}: ${(e as Error).message}`);
      }
    }, CONCURRENCY);

    // Save after each batch
    fs.writeFileSync(TOOLS_JSON_PATH, JSON.stringify(data, null, 2));
    console.log(`\n💾  Progress saved (batch ${Math.ceil((b + 1) / BATCH_SIZE)} complete)\n`);
  }

  // Final save
  fs.writeFileSync(TOOLS_JSON_PATH, JSON.stringify(data, null, 2));
  console.log(`\n✅  Done! Enriched ${processed} tools  |  Errors: ${errors}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
