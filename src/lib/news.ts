import type { NewsArticle } from '../app/news/page';

interface EventRegistryArticle {
  uri: string;
  title: string;
  body: string;
  date: string;
  time: string;
  source: {
    title: string;
    uri: string;
  };
  url: string;
  image?: string;
}

interface EventRegistryResponse {
  articles?: {
    results?: EventRegistryArticle[];
  };
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word chars (except space and dash)
    .replace(/[\s_]+/g, "-")  // Replace spaces/underscores with dashes
    .replace(/^-+|-+$/g, ""); // Trim dashes from ends
}

export async function fetchLatestAINews(count = 6): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWSAPI_AI_KEY;

  if (!apiKey) {
    console.warn("NEWSAPI_AI_KEY environment variable is not configured. Returning fallback articles.");
    return [];
  }

  try {
    const response = await fetch("https://eventregistry.org/api/v1/article/getArticles", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "getArticles",
        keyword: "artificial intelligence",
        lang: "eng",
        articlesCount: count,
        articlesSortBy: "date",
        apiKey: apiKey,
      }),
      // Set cache options for stability in Next.js
      next: {
        revalidate: 604800, // Cache for 7 days (weekly)
      }
    });

    if (!response.ok) {
      throw new Error(`Event Registry HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as EventRegistryResponse;
    const results = data.articles?.results || [];

    return results.map((article) => {
      const words = article.body.split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(words / 200)) + " min read";

      // Parse and format date to Match "July 18, 2026"
      let formattedDate = "Recently";
      if (article.date) {
        try {
          const dateObj = new Date(article.date);
          formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
        } catch (e) {
          formattedDate = article.date;
        }
      }

      // Build clean excerpt
      let excerpt = article.body;
      if (excerpt.length > 160) {
        excerpt = excerpt.slice(0, 160).trim() + "...";
      }

      return {
        id: article.uri,
        title: article.title,
        excerpt: excerpt,
        date: formattedDate,
        readTime: readTime,
        category: getCategory(article.title, article.body),
        source: article.source?.title || "AI Source",
        slug: slugify(article.title),
        url: article.url, // Link directly to original article
      };
    });
  } catch (error) {
    console.error("Error fetching AI news from Event Registry:", error);
    return []; // Return empty list to prompt dynamic fallback
  }
}
