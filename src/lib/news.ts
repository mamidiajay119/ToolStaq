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

function getCategory(title: string, body: string): string {
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
  ) {
    return "Frontier Models";
  }
  
  if (
    text.includes("agent") || 
    text.includes("copilot") || 
    text.includes("autonomous") || 
    text.includes("devin") || 
    text.includes("browser use") ||
    text.includes("operator")
  ) {
    return "AI Agents";
  }
  
  if (
    text.includes("open source") || 
    text.includes("open weights") || 
    text.includes("hugging face") || 
    text.includes("huggingface")
  ) {
    return "Open Source";
  }
  
  if (
    text.includes("next.js") || 
    text.includes("vercel") || 
    text.includes("react") || 
    text.includes("sdk") || 
    text.includes("coding") ||
    text.includes("programmer")
  ) {
    return "Web Dev";
  }
  
  if (
    text.includes("regulation") || 
    text.includes("eu ai act") || 
    text.includes("compliance") || 
    text.includes("copyright") || 
    text.includes("policy") ||
    text.includes("fine") ||
    text.includes("ban")
  ) {
    return "Regulation";
  }
  
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
  } catch (e) {
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
      headers: {
        "Authorization": currentsKey,
      }
    });

    if (!response.ok) throw new Error(`Currents API error: ${response.status}`);
    const data = await response.json() as CurrentsResponse;
    const results = data.news || [];

    if (results.length > 0) {
      // Map to db schema format
      const articles = results.map((article) => ({
        slug: slugify(article.title),
        title: article.title,
        description: article.description || "No summary available.",
        url: article.url || null,
        published_at: article.published ? new Date(article.published).toISOString() : new Date().toISOString(),
        source_name: getDomainName(article.url),
        image_url: article.image || null
      }));

      const client = getServiceRoleClient();
      
      // Upsert latest articles (on Conflict of slug, it updates)
      const { error: upsertError } = await client
        .from('news_articles')
        .upsert(articles, { onConflict: 'slug' });

      if (upsertError) throw upsertError;

      // Delete articles older than 1 month (30 days)
      const oneMonthAgo = new Date();
      oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
      
      const { error: deleteError } = await client
        .from('news_articles')
        .delete()
        .lt('published_at', oneMonthAgo.toISOString());

      if (deleteError) throw deleteError;
      console.log('Successfully completed background news sync & purge of older articles.');
    }
  } catch (e) {
    console.error('Background news sync failed:', e);
  }
}

export async function fetchLatestAINews(count = 6): Promise<NewsArticle[]> {
  try {
    // 1. Fetch latest articles from Supabase
    const { data: dbNews, error } = await supabase
      .from('news_articles')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(count);

    if (error) throw error;

    // Check if we need to sync: DB is empty, or the latest post is > 12 hours old
    let shouldSync = false;
    if (!dbNews || dbNews.length === 0) {
      shouldSync = true;
    } else {
      const newestPost = dbNews[0];
      const ageInMs = new Date().getTime() - new Date(newestPost.created_at || new Date()).getTime();
      if (ageInMs > 12 * 60 * 60 * 1000) {
        shouldSync = true;
      }
    }

    if (shouldSync) {
      if (!dbNews || dbNews.length === 0) {
        // DB is completely empty (first run): do a synchronous sync to avoid returning empty array
        console.log('News database is empty. Running initial synchronous news sync...');
        await triggerBackgroundSync();
        
        // Query again after synchronous sync
        const { data: refreshedNews } = await supabase
          .from('news_articles')
          .select('*')
          .order('published_at', { ascending: false })
          .limit(count);
          
        if (refreshedNews && refreshedNews.length > 0) {
          return mapDbNewsToArticles(refreshedNews);
        }
      } else {
        // DB has news but it is stale: trigger async sync in background, return current cache instantly
        console.log('News cache is stale. Triggering background news sync...');
        triggerBackgroundSync().catch(console.error);
      }
    }

    if (dbNews && dbNews.length > 0) {
      return mapDbNewsToArticles(dbNews);
    }
  } catch (e) {
    console.error('Failed to load news from Supabase database:', e);
  }

  // Fallback if anything fails
  return [];
}

// Map database format to frontend NewsArticle interface
function mapDbNewsToArticles(dbArticles: any[]): NewsArticle[] {
  return dbArticles.map((article) => {
    const words = (article.description || "").split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(words / 200) + 1) + " min read";

    let formattedDate = "Recently";
    if (article.published_at) {
      try {
        const dateObj = new Date(article.published_at);
        formattedDate = dateObj.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
      } catch (e) {
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
    };
  });
}
