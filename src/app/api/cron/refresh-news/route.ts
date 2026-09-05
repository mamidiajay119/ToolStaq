import { type NextRequest } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getServiceRoleClient } from '@/lib/supabase';
import { isRelevantAINews } from '@/lib/news';

// Mark as dynamic so this route is never statically cached
export const dynamic = 'force-dynamic';

interface CurrentsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  author: string;
  image?: string;
  language: string;
  category: string[];
  published: string;
}

interface CurrentsResponse {
  status: string;
  news?: CurrentsArticle[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getDomainName(urlStr: string): string {
  try {
    const url = new URL(urlStr);
    const domain = url.hostname.replace('www.', '');
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch {
    return 'AI Source';
  }
}

export async function GET(request: NextRequest) {
  // ── Security: verify Vercel Cron secret ──────────────────────────────────
  const authHeader = request.headers.get('authorization');
  const secretParam = request.nextUrl.searchParams.get('secret');
  const cronSecret = process.env.CRON_SECRET;

  if (process.env.NODE_ENV === 'production' && !cronSecret) {
    return Response.json({ error: 'CRON_SECRET environment variable is missing' }, { status: 401 });
  }

  if (cronSecret) {
    const isHeaderValid = authHeader === `Bearer ${cronSecret}`;
    const isParamValid = secretParam === cronSecret;
    if (!isHeaderValid && !isParamValid) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const currentsKey = process.env.CURRENTS_API_KEY;
  if (!currentsKey) {
    return Response.json({ error: 'CURRENTS_API_KEY not configured' }, { status: 500 });
  }

  try {
    // ── 1. Fetch fresh AI news from Currents API ──────────────────────────
    const searchQuery = encodeURIComponent(
      '"artificial intelligence" OR "generative AI" OR "large language model" OR "AI tools" OR "LLM" OR "OpenAI" OR "Anthropic"'
    );
    const url = `https://api.currentsapi.services/v1/search?query=${searchQuery}&category=technology&language=en&limit=20`;

    const response = await fetch(url, {
      method: 'GET',
      headers: { Authorization: currentsKey },
    });

    if (!response.ok) {
      throw new Error(`Currents API error: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as CurrentsResponse;
    const results = data.news ?? [];

    if (results.length === 0) {
      return Response.json({ message: 'No new articles returned by Currents API', synced: 0 });
    }

    // ── 2. Map + deduplicate articles ────────────────────────────────────
    const seen = new Set<string>();
    const articles = results
      .map((article) => ({
        slug: slugify(article.title),
        title: article.title,
        description: article.description || 'No summary available.',
        url: article.url ?? null,
        published_at: article.published
          ? new Date(article.published).toISOString()
          : new Date().toISOString(),
        source_name: getDomainName(article.url),
        image_url: article.image ?? null,
      }))
      .filter((a) => {
        if (!a.slug || seen.has(a.slug)) return false;
        if (!isRelevantAINews(a.title, a.description)) return false;
        seen.add(a.slug);
        return true;
      });

    // ── 3. Upsert into Supabase ──────────────────────────────────────────
    const client = getServiceRoleClient();

    const { error: upsertError } = await client
      .from('news_articles')
      .upsert(articles, { onConflict: 'slug' });

    if (upsertError) throw upsertError;

    // ── 4. Purge articles older than 30 days ─────────────────────────────
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    const { error: deleteError } = await client
      .from('news_articles')
      .delete()
      .lt('published_at', oneMonthAgo.toISOString());

    if (deleteError) throw deleteError;

    // ── 5. Bust the ISR cache so the news page serves fresh content ──────
    revalidatePath('/news');

    console.log(`[cron/refresh-news] Synced ${articles.length} articles at ${new Date().toISOString()}`);

    return Response.json({
      message: 'News sync completed successfully',
      synced: articles.length,
      purgedBefore: oneMonthAgo.toISOString(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[cron/refresh-news] Error:', message);
    return Response.json({ error: message }, { status: 500 });
  }
}
