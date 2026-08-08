import type { NewsArticle } from '../app/news/page';

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
    // Capitalize first letter of domain
    return domain.charAt(0).toUpperCase() + domain.slice(1);
  } catch (e) {
    return 'AI Source';
  }
}

export async function fetchLatestAINews(count = 6): Promise<NewsArticle[]> {
  const currentsKey = process.env.CURRENTS_API_KEY;

  if (!currentsKey) {
    console.warn("CURRENTS_API_KEY is not configured. Returning empty list to invoke local fallback.");
    return [];
  }

  try {
    const url = `https://api.currentsapi.services/v1/search?keywords=artificial%20intelligence&language=en&limit=${count}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": currentsKey,
      },
      next: {
        revalidate: 604800, // Cache for 7 days (weekly)
      }
    });

    if (!response.ok) {
      throw new Error(`Currents API HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as CurrentsResponse;
    const results = data.news || [];

    return results.map((article) => {
      // Estimate read time from description
      const words = (article.description || "").split(/\s+/).length;
      const readTime = Math.max(1, Math.ceil(words / 200) + 1) + " min read";

      // Parse and format publication date
      let formattedDate = "Recently";
      if (article.published) {
        try {
          const dateObj = new Date(article.published);
          formattedDate = dateObj.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          });
        } catch (e) {
          formattedDate = article.published;
        }
      }

      const sourceName = getDomainName(article.url);

      return {
        id: article.id,
        title: article.title,
        excerpt: article.description || "No summary available.",
        date: formattedDate,
        readTime: readTime,
        category: getCategory(article.title, article.description || ""),
        source: sourceName,
        slug: slugify(article.title),
        url: article.url,
      };
    });
  } catch (error) {
    console.error("Error fetching AI news from Currents API:", error);
    return []; // Return empty list to trigger local dynamic fallback
  }
}
