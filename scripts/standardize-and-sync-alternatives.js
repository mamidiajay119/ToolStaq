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

async function run() {
  console.log("Fetching all tools from Supabase...");
  let allTools = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data: chunk, error } = await supabase
      .from('tools')
      .select('id, slug, tool_name, primary_category, category, alternatives')
      .range(from, from + step - 1);

    if (error) {
      console.error(error);
      process.exit(1);
    }
    if (!chunk || chunk.length === 0) hasMore = false;
    else {
      allTools = [...allTools, ...chunk];
      if (chunk.length < step) hasMore = false;
      else from += step;
    }
  }

  console.log(`Fetched ${allTools.length} tools from database.`);

  const exactNames = new Set(allTools.map(t => t.tool_name));
  const aliasMap = {};

  // Register all exact tool names and slugs
  allTools.forEach(t => {
    aliasMap[t.tool_name.toLowerCase().trim()] = t.tool_name;
    aliasMap[t.slug.toLowerCase().trim()] = t.tool_name;
    
    // Normalized variations
    const stripped = t.tool_name
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/\.(ai|io|com|app|co)$/i, '')
      .replace(/\s+AI$/i, '')
      .trim().toLowerCase();
    if (!aliasMap[stripped]) aliasMap[stripped] = t.tool_name;
  });

  // Explicit high-priority alias overrides
  const manualOverrides = {
    'claude': 'Claude AI (Anthropic)',
    'claude ai': 'Claude AI (Anthropic)',
    'claude.ai': 'Claude AI (Anthropic)',
    'anthropic': 'Claude AI (Anthropic)',
    'anthropic claude': 'Claude AI (Anthropic)',
    'chatgpt': 'ChatGPT',
    'openai': 'ChatGPT',
    'openai chatgpt': 'ChatGPT',
    'google gemini': 'Gemini (Google)',
    'gemini': 'Gemini (Google)',
    'bard': 'Gemini (Google)',
    'perplexity': 'Perplexity',
    'perplexity ai': 'Perplexity',
    'microsoft copilot': 'Microsoft Copilot',
    'copilot': 'Microsoft Copilot',
    'bing chat': 'Microsoft Copilot',
    'cursor': 'Cursor',
    'cursor ai': 'Cursor',
    'v0': 'v0 (Vercel)',
    'v0 by vercel': 'v0 (Vercel)',
    'zapier': 'Zapier',
    'zapier central': 'Zapier',
    'runway': 'Runway',
    'runway gen-3': 'Runway',
    'runway gen-2': 'Gen-2 by Runway',
    'midjourney': 'MidJourney Prompt Helper',
    'zendesk': 'Zendesk Service Suite',
    'zendesk ai': 'Zendesk Service Suite',
    'intercom': 'Intercom',
    'intercom fin': 'Intercom',
    'copy.ai': 'Copy.ai',
    'writesonic': 'Writesonic',
    'elevenlabs': 'ElevenLabs',
    'murf ai': 'Murf AI',
    'jasper': 'Jasper',
    'jasper ai': 'Jasper',
    'tabnine': 'Tabnine'
  };

  Object.assign(aliasMap, manualOverrides);

  // Group tools by category for intelligent fallback
  const toolsByCategory = {};
  allTools.forEach(t => {
    const cats = Array.isArray(t.category) ? t.category : [];
    cats.forEach(c => {
      if (!toolsByCategory[c]) toolsByCategory[c] = [];
      toolsByCategory[c].push(t.tool_name);
    });
  });

  // Flagship chatbot cluster
  const chatbotCluster = [
    'ChatGPT',
    'Claude AI (Anthropic)',
    'Gemini (Google)',
    'Microsoft Copilot',
    'Perplexity'
  ];

  const updates = [];

  allTools.forEach(t => {
    let resolved = [];

    // Special handling for flagship chatbots
    if (chatbotCluster.includes(t.tool_name)) {
      resolved = chatbotCluster.filter(name => name !== t.tool_name);
    } else {
      const origAlts = Array.isArray(t.alternatives) ? t.alternatives : [];
      
      origAlts.forEach(alt => {
        if (!alt) return;
        const raw = String(alt).trim();
        const lower = raw.toLowerCase();

        if (manualOverrides[lower]) {
          const target = manualOverrides[lower];
          if (target !== t.tool_name && !resolved.includes(target)) {
            resolved.push(target);
          }
        } else if (exactNames.has(raw)) {
          if (raw !== t.tool_name && !resolved.includes(raw)) {
            resolved.push(raw);
          }
        } else if (aliasMap[lower]) {
          const canonical = aliasMap[lower];
          if (canonical !== t.tool_name && !resolved.includes(canonical)) {
            resolved.push(canonical);
          }
        }
      });

      // If fewer than 3 alternatives, fallback to other tools in the same category
      if (resolved.length < 3) {
        const cat = t.primary_category || (t.category && t.category[0]);
        const sameCatTools = (toolsByCategory[cat] || []).filter(name => name !== t.tool_name && !resolved.includes(name));
        
        for (const fallback of sameCatTools) {
          if (resolved.length >= 3) break;
          resolved.push(fallback);
        }
      }
    }

    updates.push({
      id: t.id,
      slug: t.slug,
      tool_name: t.tool_name,
      alternatives: resolved
    });
  });

  console.log(`Prepared ${updates.length} tool updates. Updating Supabase in batches...`);

  let updatedCount = 0;
  let errorCount = 0;
  const batchSize = 50;

  for (let i = 0; i < updates.length; i += batchSize) {
    const batch = updates.slice(i, i + batchSize);
    
    const promises = batch.map(async (item) => {
      const { error } = await supabase
        .from('tools')
        .update({ alternatives: item.alternatives })
        .eq('id', item.id);

      if (error) {
        return { success: false, id: item.id, error: error.message };
      }
      return { success: true };
    });

    const results = await Promise.all(promises);
    results.forEach(r => {
      if (r.success) updatedCount++;
      else {
        errorCount++;
        console.error(`Error updating ID ${r.id}:`, r.error);
      }
    });

    if ((i + batchSize) % 500 === 0 || i + batchSize >= updates.length) {
      console.log(`Progress: ${Math.min(i + batchSize, updates.length)} / ${updates.length} updated.`);
    }
  }

  console.log(`\n=== Supabase Update Complete ===`);
  console.log(`Successfully updated: ${updatedCount} tools (${errorCount} errors)`);

  // Also update Excel file
  const excelPath = path.resolve(__dirname, 'data/tools_rows_web_verified.xlsx');
  if (fs.existsSync(excelPath)) {
    console.log(`\nUpdating Excel file: ${excelPath}`);
    const workbook = xlsx.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const rows = xlsx.utils.sheet_to_json(sheet);

    const updateMap = new Map(updates.map(u => [u.id, u.alternatives]));

    rows.forEach(row => {
      if (updateMap.has(row.id)) {
        row.alternatives = JSON.stringify(updateMap.get(row.id));
      }
    });

    const newSheet = xlsx.utils.json_to_sheet(rows);
    workbook.Sheets[sheetName] = newSheet;
    xlsx.writeFile(workbook, excelPath);
    console.log(`Successfully updated Excel file!`);
  }
}

run();
