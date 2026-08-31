import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getToolBySlug } from '@/lib/tools';

// ── UTM config ────────────────────────────────────────────────
const UTM_SOURCE   = 'toolstaq.com';
const UTM_MEDIUM   = 'referral';
const UTM_CAMPAIGN = 'tool-directory';

/**
 * Appends UTM parameters to a plain tool URL.
 * utm_content = tool slug so each tool is individually trackable.
 *
 * NOTE: Affiliate links are intentionally NOT UTM-tagged —
 * they carry the affiliate network's own tracking params.
 * Adding UTMs on top would corrupt affiliate attribution.
 */
function buildUtmUrl(baseUrl: string, slug: string): string {
  try {
    const url = new URL(baseUrl);
    url.searchParams.set('utm_source',   UTM_SOURCE);
    url.searchParams.set('utm_medium',   UTM_MEDIUM);
    url.searchParams.set('utm_campaign', UTM_CAMPAIGN);
    url.searchParams.set('utm_content',  slug);
    return url.toString();
  } catch {
    // If the URL is somehow malformed, fall back to the original
    return baseUrl;
  }
}

// ── Affiliate link map ────────────────────────────────────────
// Populate as you join affiliate programs.
// When an affiliate link is present, it is used as-is (no UTM tagging).
const AFFILIATE_LINKS: Record<string, string> = {
  // 'jasper': 'https://jasper.ai/?via=YOUR_ID',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);

  if (!tool) {
    redirect('/tools');
  }

  // ── Fire-and-forget click tracking ───────────────────────────
  // We call /api/track BEFORE redirect() because redirect() terminates
  // the response immediately — nothing after it executes.
  // We intentionally do NOT await this fetch so the redirect is instant.
  try {
    const referrer = request.headers.get('referer') || '';
    // Extract just the pathname from the referer (strip domain)
    let referrerPath: string | null = null;
    try {
      referrerPath = new URL(referrer).pathname;
    } catch {
      referrerPath = referrer || null;
    }

    const origin = request.nextUrl.origin; // e.g. https://toolstaq.com
    fetch(`${origin}/api/track`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        slug,
        tool_name:     tool.tool_name,
        referrer_path: referrerPath,
        user_agent:    request.headers.get('user-agent')?.slice(0, 200) || '',
      }),
    }).catch(() => {
      // Silently swallow — tracking must never affect the redirect
    });
  } catch {
    // Non-blocking — never fail the redirect
  }

  // ── Destination URL ───────────────────────────────────────────
  // Affiliate link takes priority (used as-is, no UTM modification).
  // Plain tool URL gets UTM params appended.
  const destination = AFFILIATE_LINKS[slug] ?? buildUtmUrl(tool.url, slug);

  redirect(destination);
}
