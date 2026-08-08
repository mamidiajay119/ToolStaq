/**
 * Build a FRESH tools.json from AI_Tools_in_Toolstaq_Final_8Aug.xlsx
 *
 * This replaces the old tools.json entirely.  Every field in the Tool
 * interface is populated from a combination of:
 *   - Direct Excel columns (url, tool_name, description, category, …)
 *   - The embedded `json_output` column (core_features, integrations,
 *     starting_price_usd — data that only exists there)
 *   - The four new enriched columns (Focus Area, Core Features &
 *     Capabilities, Technical Architecture & Security, Pricing Details)
 */

const fs   = require('fs');
const path = require('path');
const xlsx = require('xlsx');

// ── paths ──
const EXCEL = path.join(__dirname, 'data/AI_Tools_in_Toolstaq_Final_8Aug.xlsx');
const OUT   = path.join(__dirname, '../public/data/tools.json');

// ── helpers ──
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function splitPipe(val: any): string[] {
  if (!val) return [];
  return String(val)
    .split('|')
    .map((s: string) => s.trim())
    .filter(Boolean);
}

const CATEGORY_ICONS: Record<string, string> = {
  'AI Writing':          '✍️',
  'AI Coding':           '💻',
  'AI Video':            '🎬',
  'AI Audio':            '🎵',
  'AI Design':           '🎨',
  'AI Research':         '🔬',
  'AI Automation':       '⚡',
  'AI Productivity':     '📊',
  'AI Analytics':        '📈',
  'AI Customer Support': '💬',
  'AI Sales':            '💰',
  'AI Marketing':        '📣',
  'AI HR':               '👥',
  'AI Education':        '🎓',
  'AI Legal':            '⚖️',
  'AI Finance':          '💵',
  'AI Healthcare':       '🏥',
  'AI Translation':      '🌐',
  'AI Image':            '🖼️',
  'AI Chat':             '🤖',
  'AI Security':         '🔒',
  'AI Data Extraction':  '📋',
  'AI Presentation':     '📽️',
  'AI Social Media':     '📱',
  'AI Voice':            '🗣️',
  'AI Avatar':           '👤',
  'AI Search':           '🔍',
};

// ── read Excel ──
console.log('Reading Excel …');
const wb    = xlsx.readFile(EXCEL);
const rows  = xlsx.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]) as any[];
console.log(`  ${rows.length} rows found.`);

// ── build tools ──
const seenSlugs = new Set<string>();
const tools: any[] = [];
let dupeCount = 0;

for (const row of rows) {
  if (!row.url || !row.tool_name) continue;

  // Parse embedded json_output for fields only available there
  let parsed: any = {};
  try {
    parsed = JSON.parse(row.json_output || '{}');
  } catch { /* ignore bad json */ }

  const categories = splitPipe(row.category);
  const primary    = categories[0] || 'AI Tools';

  let slug = slugify(row.tool_name);
  if (seenSlugs.has(slug)) {
    dupeCount++;
    slug = `${slug}-${dupeCount}`;
  }
  seenSlugs.add(slug);

  const tool = {
    slug,
    tool_name:            row.tool_name,
    url:                  row.url,
    category:             categories,
    primary_category:     primary,
    icon:                 CATEGORY_ICONS[primary] || '🤖',
    favicon_url:          row.favicon_url || undefined,
    title:                row._scraped_title || '',
    description:          row.description || '',
    features:             [], // legacy — kept for interface compat
    target_segment:       splitPipe(row.target_segment),
    target_user_persona:  splitPipe(row.target_user_persona),
    best_for:             splitPipe(row.best_for),
    not_suitable_for:     splitPipe(row.not_suitable_for),
    core_features:        Array.isArray(parsed.core_features) ? parsed.core_features : [],
    integrations:         Array.isArray(parsed.integrations) ? parsed.integrations : [],
    starting_price_usd:   parsed.starting_price_usd ?? null,
    pricing_model:        row.pricing_model || '',
    value_metric:         row.value_metric || '',
    time_to_value:        row.time_to_value || '',
    complexity_level:     row.complexity_level || '',
    deployment:           row.deployment || '',
    has_api:              row.has_api === true || row.has_api === 'TRUE' || row.has_api === 'true',
    free_trial:           row.free_trial === true || row.free_trial === 'TRUE' || row.free_trial === 'true',
    open_source:          row.open_source === true || row.open_source === 'TRUE' || row.open_source === 'true',
    alternatives:         splitPipe(row.alternatives).filter((a: string) => a !== row.tool_name),
    decision_summary:     row.decision_summary || '',
    focus_area:           (row['Focus Area'] || '').trim() || undefined,
    core_features_rich:   (row['Core Features & Capabilities'] || '').trim() || undefined,
    technical_architecture: (row['Technical Architecture & Security'] || '').trim() || undefined,
    pricing_details:      (row['Pricing Details'] || '').trim() || undefined,
  };

  tools.push(tool);
}

// ── compute category counts ──
const categoryCounts: Record<string, number> = {};
for (const t of tools) {
  for (const c of t.category) {
    categoryCounts[c] = (categoryCounts[c] || 0) + 1;
  }
}

// ── build final JSON ──
const output = {
  meta: {
    total:      tools.length,
    categories: Object.keys(categoryCounts).length,
    generated:  new Date().toISOString(),
  },
  category_counts: categoryCounts,
  tools,
};

console.log('Writing tools.json …');
fs.writeFileSync(OUT, JSON.stringify(output, null, 2), 'utf8');
console.log(`Done!  ${tools.length} tools, ${Object.keys(categoryCounts).length} categories.`);

// Quick sanity check
const heygen = tools.find((t: any) => t.tool_name === 'HeyGen');
if (heygen) {
  console.log('\nHeyGen sanity check:');
  console.log('  focus_area:', heygen.focus_area ? '✓' : '✗');
  console.log('  core_features_rich:', heygen.core_features_rich ? '✓' : '✗');
  console.log('  technical_architecture:', heygen.technical_architecture ? '✓' : '✗');
  console.log('  pricing_details:', heygen.pricing_details ? '✓' : '✗');
}
