global.WebSocket = require('ws');
const { createClient } = require('@supabase/supabase-js');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Parse .env.local
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

function parseJsonArray(val) {
  if (val === undefined || val === null) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const s = val.trim();
    if (s === '') return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
      return [parsed];
    } catch (e) {
      return s.split(',').map(item => item.trim()).filter(Boolean);
    }
  }
  return [String(val)];
}

async function run() {
  const excelPath = path.resolve(__dirname, 'data/tools_rows_web_verified.xlsx');
  console.log("Reading data from:", excelPath);

  if (!fs.existsSync(excelPath)) {
    console.error("Excel file does not exist at:", excelPath);
    process.exit(1);
  }

  const workbook = xlsx.readFile(excelPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet);

  console.log(`Loaded ${rows.length} rows from Excel.`);

  let updatedCount = 0;
  let errorCount = 0;
  const batchSize = 50;

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    // Process concurrently in small batches
    const updatePromises = batch.map(async (row) => {
      const toolId = row.id;
      const toolSlug = row.slug;
      
      const categoryArray = parseJsonArray(row.category);
      const alternativesArray = parseJsonArray(row.alternatives);
      const primaryCategory = row.primary_category ? String(row.primary_category).trim() : (categoryArray[0] || '');

      const payload = {
        category: categoryArray,
        primary_category: primaryCategory,
        alternatives: alternativesArray
      };

      let query = supabase.from('tools').update(payload);
      if (toolId) {
        query = query.eq('id', toolId);
      } else if (toolSlug) {
        query = query.eq('slug', toolSlug);
      } else {
        return { success: false, error: 'No ID or slug' };
      }

      const { error } = await query;
      if (error) {
        return { success: false, id: toolId, slug: toolSlug, error: error.message };
      }
      return { success: true };
    });

    const results = await Promise.all(updatePromises);
    for (const res of results) {
      if (res.success) {
        updatedCount++;
      } else {
        errorCount++;
        console.error(`Error updating tool (ID: ${res.id}, slug: ${res.slug}):`, res.error);
      }
    }

    if ((i + batchSize) % 500 === 0 || i + batchSize >= rows.length) {
      console.log(`Progress: ${Math.min(i + batchSize, rows.length)} / ${rows.length} processed (${updatedCount} updated, ${errorCount} errors)`);
    }
  }

  console.log(`\n=== Update Complete ===`);
  console.log(`Total updated: ${updatedCount}`);
  console.log(`Total errors: ${errorCount}`);
}

run();
