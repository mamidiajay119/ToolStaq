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
const supabaseKey = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration in .env.local!");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  const excelPath = path.resolve(__dirname, 'part13.xlsx');
  console.log("Reading rich metadata from:", excelPath);

  if (!fs.existsSync(excelPath)) {
    console.error("Excel file does not exist at:", excelPath);
    process.exit(1);
  }

  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log(`Parsed ${rows.length} rows. Appending values to Supabase tools table...`);

  let successCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;

  for (const row of rows) {
    const toolName = row['Tool Name'];
    if (!toolName) continue;

    const name = String(toolName).trim();
    const slug = slugify(name);

    const updateData = {
      focus_area: row['Primary Category'] ? String(row['Primary Category']).trim() : null,
      core_features_rich: row['Core Features'] ? String(row['Core Features']).trim() : null,
      technical_architecture: row['Technical Architecture'] ? String(row['Technical Architecture']).trim() : null,
      pricing_details: row['Pricing & Licensing'] ? String(row['Pricing & Licensing']).trim() : null
    };

    console.log(`Updating rich fields for: "${name}" (slug: ${slug})`);

    const { data: existing, error: checkError } = await supabase
      .from('tools')
      .select('slug')
      .eq('slug', slug)
      .maybeSingle();

    if (checkError) {
      console.error(`Error searching for slug "${slug}":`, checkError.message);
      errorCount++;
      continue;
    }

    if (!existing) {
      console.warn(`⚠️ Tool not found in database for slug "${slug}" (name: "${name}")`);
      notFoundCount++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('tools')
      .update(updateData)
      .eq('slug', slug);

    if (updateError) {
      console.error(`Failed to update metadata for "${name}":`, updateError.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`\nMetadata updates complete!`);
  console.log(`Successfully updated: ${successCount} tools`);
  console.log(`Not found: ${notFoundCount} tools`);
  console.log(`Errors encountered: ${errorCount}`);
}

run();
