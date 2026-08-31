/**
 * upload-affiliates.ts
 * ---------------------
 * Reads a CSV file of affiliate program data and upserts it into
 * the tool_affiliates table in Supabase.
 *
 * Usage:
 *   npx tsx scripts/upload-affiliates.ts [path/to/affiliates.csv]
 *
 * If no path is given, defaults to: scripts/data/affiliates.csv
 *
 * Required CSV columns (header row):
 *   tool_slug, tool_name, url, affiliate_link, network, commission
 *
 * Optional CSV columns:
 *   commission_type, commission_rate, cookie_duration_days,
 *   payout_threshold_usd, payout_methods, status, notes
 *
 * REQUIRED env vars (in .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '../.env.local') });

// ── Supabase (service role — bypasses RLS) ───────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

// ── CSV helpers ──────────────────────────────────────────────
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function nullIfEmpty(val: string | undefined): string | null {
  return val && val.trim() !== '' ? val.trim() : null;
}

function numOrNull(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null;
  const n = parseFloat(val);
  return isNaN(n) ? null : n;
}

function intOrNull(val: string | undefined): number | null {
  if (!val || val.trim() === '') return null;
  const n = parseInt(val, 10);
  return isNaN(n) ? null : n;
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  const csvPath = process.argv[2]
    || path.join(__dirname, 'data/affiliates.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌  CSV not found: ${csvPath}`);
    console.log('   Create scripts/data/affiliates.csv with columns:');
    console.log('   tool_slug,tool_name,url,affiliate_link,network,commission,...');
    process.exit(1);
  }

  console.log(`📂  Reading: ${csvPath}`);

  const lines: string[] = [];
  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath),
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    lines.push(line);
  }

  if (lines.length < 2) {
    console.error('❌  CSV has no data rows (need at least header + 1 row)');
    process.exit(1);
  }

  const headers = parseCSVLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, '_'));
  console.log(`📋  Columns detected: ${headers.join(', ')}`);

  // Validate required columns
  const REQUIRED = ['tool_slug', 'tool_name', 'url'];
  const missing = REQUIRED.filter((r) => !headers.includes(r));
  if (missing.length) {
    console.error(`❌  Missing required columns: ${missing.join(', ')}`);
    process.exit(1);
  }

  const get = (row: string[], col: string) => row[headers.indexOf(col)];

  const records: any[] = [];
  const skipped: number[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const row = parseCSVLine(line);
    const tool_slug = nullIfEmpty(get(row, 'tool_slug'));
    const tool_name = nullIfEmpty(get(row, 'tool_name'));
    const url       = nullIfEmpty(get(row, 'url'));

    if (!tool_slug || !tool_name || !url) {
      skipped.push(i + 1);
      continue;
    }

    const rawStatus = nullIfEmpty(get(row, 'status'));
    const validStatuses = ['active', 'pending', 'applied', 'inactive', 'rejected'];
    const status = (rawStatus && validStatuses.includes(rawStatus))
      ? rawStatus
      : 'pending';

    const rawPayouts = nullIfEmpty(get(row, 'payout_methods'));
    const payout_methods = rawPayouts
      ? rawPayouts.split('|').map((s) => s.trim()).filter(Boolean)
      : null;

    records.push({
      tool_slug,
      tool_name,
      url,
      affiliate_link:       nullIfEmpty(get(row, 'affiliate_link')),
      network:              nullIfEmpty(get(row, 'network')),
      commission:           nullIfEmpty(get(row, 'commission')),
      commission_type:      nullIfEmpty(get(row, 'commission_type')),
      commission_rate:      numOrNull(get(row, 'commission_rate')),
      cookie_duration_days: intOrNull(get(row, 'cookie_duration_days')),
      payout_threshold_usd: numOrNull(get(row, 'payout_threshold_usd')),
      payout_methods,
      status,
      notes:                nullIfEmpty(get(row, 'notes')),
      verified_at:          nullIfEmpty(get(row, 'verified_at')),
    });
  }

  console.log(`✅  Parsed ${records.length} records  |  ⚠️  Skipped rows: ${skipped.length > 0 ? skipped.join(', ') : 'none'}`);

  if (!records.length) {
    console.log('Nothing to upload.');
    return;
  }

  // Upsert in batches of 200
  const BATCH = 200;
  let uploaded = 0;
  for (let i = 0; i < records.length; i += BATCH) {
    const batch = records.slice(i, i + BATCH);
    const { error } = await supabase
      .from('tool_affiliates')
      .upsert(batch, { onConflict: 'tool_slug' });

    if (error) {
      console.error(`❌  Batch ${Math.ceil(i / BATCH) + 1} failed: ${error.message}`);
    } else {
      uploaded += batch.length;
      console.log(`   ✓ Batch ${Math.ceil(i / BATCH) + 1}: ${batch.length} rows upserted`);
    }
  }

  console.log(`\n🎉  Done! ${uploaded}/${records.length} affiliate records upserted.`);
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
