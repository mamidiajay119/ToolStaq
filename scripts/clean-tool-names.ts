import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

async function fetchToolsRange(from: number, to: number) {
  const res = await fetch(`${supabaseUrl}/rest/v1/tools?select=slug,tool_name`, {
    headers: {
      'apikey': serviceRoleKey!,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Range': `${from}-${to}`,
    },
  });
  if (!res.ok) throw new Error(`Fetch tools failed: ${res.statusText}`);
  return res.json();
}

async function updateToolName(slug: string, newName: string) {
  const res = await fetch(`${supabaseUrl}/rest/v1/tools?slug=eq.${slug}`, {
    method: 'PATCH',
    headers: {
      'apikey': serviceRoleKey!,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tool_name: newName }),
  });
  return res.ok;
}

async function cleanAllToolNames() {
  console.log('🔍 Fetching all tools across pages from Supabase...');
  let from = 0;
  const step = 1000;
  let hasMore = true;
  let totalCleaned = 0;

  while (hasMore) {
    const chunk = await fetchToolsRange(from, from + step - 1);
    if (!chunk || chunk.length === 0) {
      hasMore = false;
      break;
    }

    for (const t of chunk) {
      const rawName = t.tool_name || '';
      // Strip any trailing parenthetical provider name like "(Google)", "(Anthropic)", "(OpenAI)", "(Vercel)", "(Meta)" etc.
      const cleanedName = rawName.replace(/\s*\([^)]+\)$/i, '').trim();

      if (cleanedName && cleanedName !== rawName) {
        console.log(`🧹 Cleaning: "${rawName}" -> "${cleanedName}" (slug: ${t.slug})`);
        const success = await updateToolName(t.slug, cleanedName);
        if (success) totalCleaned++;
      }
    }

    if (chunk.length < step) {
      hasMore = false;
    } else {
      from += step;
    }
  }

  console.log(`🎉 Completed! Total cleaned tool names in database: ${totalCleaned}`);
}

cleanAllToolNames().catch(console.error);
