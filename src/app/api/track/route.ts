import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase';
import type { TrackClickPayload } from '@/types/analytics';

// Known bot UA substrings — extend as needed
const BOT_PATTERNS = [
  'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
  'yandexbot', 'sogou', 'exabot', 'facebot', 'ia_archiver',
  'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot', 'rogerbot',
  'linkedinbot', 'twitterbot', 'facebookexternalhit', 'applebot',
  'headlesschrome', 'phantomjs', 'wget', 'curl/',
];

function isBot(ua: string): boolean {
  const lower = ua.toLowerCase();
  return BOT_PATTERNS.some((pattern) => lower.includes(pattern));
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as TrackClickPayload;
    const { slug, tool_name, referrer_path, user_agent } = body;

    if (!slug || !tool_name) {
      return NextResponse.json({ error: 'Missing slug or tool_name' }, { status: 400 });
    }

    // Skip bot traffic
    const ua = (user_agent || '').slice(0, 200);
    if (ua && isBot(ua)) {
      return NextResponse.json({ skipped: 'bot' });
    }

    const client = getServiceRoleClient();
    const { error } = await client.from('tool_clicks').insert({
      tool_slug:    slug,
      tool_name,
      referrer_path: referrer_path || null,
      user_agent:   ua || null,
    });

    if (error) {
      // Log server-side but don't expose details to caller
      console.error('[track] insert error:', error.message);
      return NextResponse.json({ error: 'insert failed' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[track] unexpected error:', err);
    return NextResponse.json({ error: 'unexpected' }, { status: 500 });
  }
}
