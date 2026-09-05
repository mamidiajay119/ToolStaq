import { fetchLatestAINews, fetchTopThisWeek } from '@/lib/news';
import type { NewsArticle } from '@/app/news/page';

/**
 * Aggregates the Top 5 AI News Headlines for the newsletter digest
 */
export async function getTopAINewsForNewsletter(limit: number = 5): Promise<NewsArticle[]> {
  try {
    // Try fetching top performing articles first
    const topArticles = await fetchTopThisWeek(limit);
    if (topArticles && topArticles.length >= limit) {
      return topArticles.slice(0, limit);
    }

    // Fallback to latest AI news articles
    const latestArticles = await fetchLatestAINews(limit * 2);
    if (latestArticles && latestArticles.length > 0) {
      return latestArticles.slice(0, limit);
    }

    return [];
  } catch (error) {
    console.error('[Newsletter Aggregator] Error fetching AI news:', error);
    return [];
  }
}
