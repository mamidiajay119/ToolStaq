global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Parse .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] ? match[2].trim() : '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    envVars[match[1]] = value;
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
// Use service role key to bypass RLS for administrative load
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Emojis mapping for categories
const EMOJI_MAPPING = {
  'AI Writing': '📝',
  'AI Coding': '💻',
  'AI Video': '🎥',
  'AI Audio': '🎧',
  'AI Design': '🎨',
  'AI Research': '🔬',
  'AI Automation': '🤖',
  'AI Productivity': '⚡',
  'AI Analytics': '📊',
  'AI Customer Support': '💬',
  'AI Sales': '💰',
  'AI Marketing': '📢',
  'AI HR': '👥',
  'AI Education': '🎓',
  'AI Legal': '⚖️',
  'AI Finance': '💳',
  'AI Healthcare': '🏥',
  'AI Translation': '🌐',
  'AI Image': '🖼️',
  'AI Chat': '💬',
  'AI Security': '🛡️',
  'AI Data Extraction': '🗄️',
  'AI Presentation': '📊',
  'AI Social Media': '📱',
  'AI Voice': '🗣️',
  'AI Avatar': '👤',
  'AI Search': '🔍',
  'AI Travel': '✈️'
};

function getEmojiForCategory(category) {
  return EMOJI_MAPPING[category] || '⚡';
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseArrayField(val) {
  if (val === undefined || val === null) return [];
  if (Array.isArray(val)) return val;
  const s = String(val).trim();
  if (s === "") return [];
  // Split by pipe '|', comma ',', or semicolon ';'
  const parts = s.split(/[|;,]/);
  return parts.map(p => p.trim()).filter(p => p !== "");
}

function parseBool(val) {
  if (val === undefined || val === null) return false;
  if (typeof val === 'boolean') return val;
  if (typeof val === 'number') return val === 1;
  const s = String(val).toLowerCase().trim();
  return s === 'true' || s === 'yes' || s === '1';
}

function parseNumber(val) {
  if (val === undefined || val === null) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

async function load() {
  const excelPath = path.resolve(__dirname, 'newtools_Aug11.xlsx');
  console.log("Reading excel file:", excelPath);

  if (!fs.existsSync(excelPath)) {
    console.error("Excel file does not exist at:", excelPath);
    process.exit(1);
  }

  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log(`Parsed ${rows.length} tools. Beginning database load...`);

  let successCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    if (!row.tool_name || !row.url) {
      console.warn("Skipping invalid row (missing tool_name or url):", row);
      continue;
    }

    const name = String(row.tool_name).trim();
    const slug = slugify(name);

    // Categories
    const categories = parseArrayField(row.category);
    const primaryCategory = categories[0] || 'AI Productivity';

    // Map to Supabase table schema
    const toolRecord = {
      slug: slug,
      tool_name: name,
      url: String(row.url).trim(),
      category: categories,
      primary_category: primaryCategory,
      icon: getEmojiForCategory(primaryCategory),
      favicon_url: row.favicon_url ? String(row.favicon_url).trim() : null,
      title: row._scraped_title ? String(row._scraped_title).trim() : name,
      description: row.description ? String(row.description).trim() : '',
      features: parseArrayField(row.features),
      target_segment: parseArrayField(row.target_segment),
      target_user_persona: parseArrayField(row.target_user_persona),
      best_for: parseArrayField(row.best_for),
      not_suitable_for: parseArrayField(row.not_suitable_for),
      core_features: parseArrayField(row.core_features),
      integrations: parseArrayField(row.integrations),
      starting_price_usd: parseNumber(row.starting_price_usd),
      pricing_model: row.pricing_model ? String(row.pricing_model).trim().toLowerCase() : 'free',
      value_metric: row.value_metric ? String(row.value_metric).trim() : 'Free',
      time_to_value: row.time_to_value ? String(row.time_to_value).trim() : 'Instant',
      complexity_level: row.complexity_level ? String(row.complexity_level).trim() : 'Beginner',
      deployment: row.deployment ? String(row.deployment).trim() : 'Cloud',
      has_api: parseBool(row.has_api),
      free_trial: parseBool(row.free_trial),
      open_source: parseBool(row.open_source),
      alternatives: parseArrayField(row.alternatives),
      decision_summary: row.decision_summary ? String(row.decision_summary).trim() : '',
      is_recommended: false,
      is_new: true,
      created_at: new Date().toISOString()
    };

    console.log(`Upserting tool: ${name} (slug: ${slug})`);

    const { error } = await supabase
      .from('tools')
      .upsert(toolRecord, { onConflict: 'slug' });

    if (error) {
      console.error(`Failed to upsert "${name}":`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\nLoad completed!`);
  console.log(`Successfully upserted: ${successCount} tools`);
  console.log(`Errors: ${errorCount} tools`);
}

load();
