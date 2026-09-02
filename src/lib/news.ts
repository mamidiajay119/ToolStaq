import type { NewsArticle } from '../app/news/page';
import { supabase, getServiceRoleClient } from './supabase';

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
const ENTERTAINMENT_BLOCKLIST = [
  'actor', 'actress', 'movie', 'film', 'star', 'bollywood', 'hollywood',
  'celebrity', 'gossip', 'fake video', 'deepfake video', 'reacts to', 'reacts',
  'viral video', 'scandal', 'dating', 'relationship', 'box office', 'trailer',
  'drama', 'cinema', 'entertainment', 'pop culture', 'paparazzi', 'influencer',
  'faceless side', 'side business', 'shein', 'history a school'
];

export function isRelevantAINews(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  for (const term of ENTERTAINMENT_BLOCKLIST) {
    if (text.includes(term)) return false;
  }
  return true;
}

export function getCategory(title: string, body: string): string {
  const text = `${title} ${body}`.toLowerCase();

  if (
    text.includes("openai") ||
    text.includes("gpt") ||
    text.includes("claude") ||
    text.includes("gemini") ||
    text.includes("anthropic") ||
    text.includes("deepmind") ||
    text.includes("meta llama") ||
    text.includes("llama 4") ||
    text.includes("frontier model")
  ) return "Frontier Models";

  if (
    text.includes("agent") ||
    text.includes("copilot") ||
    text.includes("autonomous") ||
    text.includes("devin") ||
    text.includes("browser use") ||
    text.includes("operator")
  ) return "AI Agents";

  if (
    text.includes("open source") ||
    text.includes("open weights") ||
    text.includes("hugging face") ||
    text.includes("huggingface")
  ) return "Open Source";

  if (
    /\b(reactjs|react\.js|next\.js|nextjs|vercel|coding|programmer|developer|typescript|javascript|frontend|backend|web dev|webdev|sdk|api)\b/i.test(text)
  ) return "Web Dev";

  if (
    text.includes("regulation") ||
    text.includes("eu ai act") ||
    text.includes("compliance") ||
    text.includes("copyright") ||
    text.includes("policy") ||
    text.includes("fine") ||
    text.includes("ban")
  ) return "Regulation";

  return "AI News";
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
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

// Background sync & 1-month purge function
async function triggerBackgroundSync() {
  const currentsKey = process.env.CURRENTS_API_KEY;
  if (!currentsKey) return;

  try {
    const searchQuery = encodeURIComponent('"artificial intelligence" OR "generative AI" OR "large language model" OR "AI tools" OR "LLM" OR "OpenAI" OR "Anthropic"');
    const url = `https://api.currentsapi.services/v1/search?query=${searchQuery}&category=technology&language=en&limit=15`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Authorization": currentsKey },
    });

    if (!response.ok) throw new Error(`Currents API error: ${response.status}`);
    const data = await response.json() as CurrentsResponse;
    const results = data.news || [];

    if (results.length > 0) {
      const articles = results.map((article) => ({
        slug: slugify(article.title),
        title: article.title,
        description: article.description || "No summary available.",
        url: article.url || null,
        published_at: article.published ? new Date(article.published).toISOString() : new Date().toISOString(),
        source_name: getDomainName(article.url),
        image_url: article.image || null,
      }));

      const uniqueArticles: typeof articles = [];
      const seenSlugs = new Set<string>();
      for (const article of articles) {
        if (article.slug && !seenSlugs.has(article.slug) && isRelevantAINews(article.title, article.description)) {
          seenSlugs.add(article.slug);
          uniqueArticles.push(article);
        }
      }

      const client = getServiceRoleClient();
      const { error: upsertError } = await client
        .from('news_articles')
        .upsert(uniqueArticles, { onConflict: 'slug' });
      if (upsertError) throw upsertError;

      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      const { error: deleteError } = await client
        .from('news_articles')
        .delete()
        .lt('published_at', oneMonthAgo.toISOString());
      if (deleteError) throw deleteError;

      console.log('Successfully completed background news sync & purge.');
    }
  } catch (e) {
    console.error('Background news sync failed:', e);
  }
}

export async function fetchLatestAINews(count = 40): Promise<NewsArticle[]> {
  try {
    const { data: dbNews, error } = await supabase
      .from('news_articles')
      .select('id, slug, title, description, url, published_at, source_name, image_url, view_count, created_at')
      .order('published_at', { ascending: false })
      .limit(count);

    if (error) throw error;

    let shouldSync = false;
    if (!dbNews || dbNews.length === 0) {
      shouldSync = true;
    } else {
      const newestPost = dbNews[0];
      const ageInMs = new Date().getTime() - new Date(newestPost.created_at || new Date()).getTime();
      if (ageInMs > 12 * 60 * 60 * 1000) shouldSync = true;
    }

    if (shouldSync) {
      if (!dbNews || dbNews.length === 0) {
        console.log('News database is empty. Running initial synchronous news sync...');
        await triggerBackgroundSync();
        const { data: refreshedNews } = await supabase
          .from('news_articles')
          .select('id, slug, title, description, url, published_at, source_name, image_url, view_count, created_at')
          .order('published_at', { ascending: false })
          .limit(count);
        if (refreshedNews && refreshedNews.length > 0) {
          return mapDbNewsToArticles(refreshedNews);
        }
      } else {
        console.log('News cache is stale. Triggering background news sync...');
        triggerBackgroundSync().catch(console.error);
      }
    }

    if (dbNews && dbNews.length > 0) return mapDbNewsToArticles(dbNews);
  } catch (e) {
    console.error('Failed to load news from Supabase database:', e);
  }
  return [];
}

/**
 * Fetch top articles from the last 7 days ordered by view_count DESC.
 * Falls back to the 3 most recent articles when all view counts are 0.
 */
export async function fetchTopThisWeek(limit = 3): Promise<NewsArticle[]> {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const { data, error } = await supabase
      .from('news_articles')
      .select('id, slug, title, description, url, published_at, source_name, image_url, view_count, created_at')
      .gte('published_at', oneWeekAgo.toISOString())
      .order('view_count', { ascending: false })
      .order('published_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    if (data && data.length > 0) return mapDbNewsToArticles(data);

    // Cold-start fallback: return most recent articles regardless of date
    const { data: fallback } = await supabase
      .from('news_articles')
      .select('id, slug, title, description, url, published_at, source_name, image_url, view_count, created_at')
      .order('published_at', { ascending: false })
      .limit(limit);

    return fallback ? mapDbNewsToArticles(fallback) : [];
  } catch (e) {
    console.error('Failed to fetch top this week:', e);
    return [];
  }
}

/**
 * Increment view_count for a given article slug.
 * Called from the API route /api/news/view (server-side, service role key).
 */
export async function incrementViewCount(slug: string): Promise<void> {
  try {
    const client = getServiceRoleClient();
    const { data: article } = await client
      .from('news_articles')
      .select('id, view_count')
      .eq('slug', slug)
      .single();

    if (!article) return;

    await client
      .from('news_articles')
      .update({ view_count: (article.view_count ?? 0) + 1 })
      .eq('id', article.id);
  } catch (e) {
    console.error('Failed to increment view count:', e);
  }
}

function mapDbNewsToArticles(dbArticles: any[]): NewsArticle[] {
  return dbArticles.map((article) => {
    const words = (article.description || "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200) + 1) + " min read";

    let formattedDate = "Recently";
    if (article.published_at) {
      try {
        formattedDate = new Date(article.published_at).toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      } catch {
        formattedDate = article.published_at;
      }
    }

    return {
      id: String(article.id),
      title: article.title,
      excerpt: article.description,
      date: formattedDate,
      readTime,
      category: getCategory(article.title, article.description),
      source: article.source_name || 'AI Source',
      slug: article.slug,
      url: article.url || undefined,
      image_url: article.image_url || undefined,
      view_count: article.view_count ?? 0,
    };
  });
}
