import type { Metadata } from 'next';
import { fetchLatestAINews, fetchTopThisWeek } from '@/lib/news';
import NewsClient from './NewsClient';
import { getAbsoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'AI News, Breakthroughs & Trend Analysis — toolstaq',
  description: 'Stay ahead of the curve with the latest news, releases, and trends in Artificial Intelligence. Curated daily by toolstaq.',
  alternates: {
    canonical: getAbsoluteUrl('/news'),
  },
  openGraph: {
    title: 'AI News, Breakthroughs & Trends — toolstaq',
    description: 'Curated daily AI news covering frontier models, open-source AI, regulations, and agent breakthroughs.',
    url: getAbsoluteUrl('/news'),
  },
};

// ISR: re-render after 24h. /api/cron/refresh-news calls revalidatePath('/news') at midnight UTC.
export const revalidate = 86400;

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  source: string;
  slug: string;
  url?: string;
  image_url?: string;
  view_count: number;
}

const STATIC_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    title: 'OpenAI Announces GPT-5: A Leap Towards System 3 Reasoning',
    excerpt: 'OpenAI has officially unveiled its next-generation frontier model, boasting unprecedented capabilities in complex mathematical reasoning, long-horizon planning, and coding synthesis.',
    date: 'July 18, 2026',
    readTime: '5 min read',
    category: 'Frontier Models',
    source: 'TechCrunch',
    slug: 'openai-announces-gpt-5',
    view_count: 0,
  },
  {
    id: '2',
    title: 'Claude 3.8 Sonnet Sets New Benchmark for Multi-Modal Agents',
    excerpt: 'Anthropic\'s latest release demonstrates massive gains in interactive browser use, tool execution, and visual document analysis.',
    date: 'July 15, 2026',
    readTime: '4 min read',
    category: 'AI Agents',
    source: 'Anthropic Blog',
    slug: 'claude-3-8-sonnet-benchmark',
    view_count: 0,
  },
  {
    id: '3',
    title: 'Meta Releases Llama 4: The 405B Fully Open weights Giant',
    excerpt: 'Meta continues its commitment to open source AI by publishing Llama 4, matching proprietary models on coding, translation, and structured data extraction.',
    date: 'July 12, 2026',
    readTime: '6 min read',
    category: 'Open Source',
    source: 'Meta AI',
    slug: 'meta-releases-llama-4',
    view_count: 0,
  },
  {
    id: '4',
    title: 'Next.js 16 Integrates Server Actions directly with Vercel AI SDK',
    excerpt: 'The newest release of Next.js simplifies streaming LLM responses, structured JSON parsing, and generative UI generation with deep framework integrations.',
    date: 'July 09, 2026',
    readTime: '3 min read',
    category: 'Open Source',
    source: 'Vercel',
    slug: 'nextjs-16-vercel-ai-sdk',
    view_count: 0,
  },
  {
    id: '5',
    title: 'AI Coding Tools See 300% Year-over-Year Enterprise Adoption',
    excerpt: 'A comprehensive market report reveals that over 80% of Fortune 500 companies have integrated AI assistants into their primary software engineering workflows.',
    date: 'July 05, 2026',
    readTime: '4 min read',
    category: 'AI News',
    source: 'Gartner',
    slug: 'ai-coding-tools-enterprise-adoption',
    view_count: 0,
  },
  {
    id: '6',
    title: 'EU AI Act Fully Enters Into Force: What Developers Need to Know',
    excerpt: 'As compliance rules become active, developers must audit their data pipelines, safety guardrails, and model validation methods to avoid heavy fines.',
    date: 'July 01, 2026',
    readTime: '5 min read',
    category: 'Regulation',
    source: 'EU Commission',
    slug: 'eu-ai-act-developers-compliance',
    view_count: 0,
  },
];

export default async function NewsPage() {
  const [newsArticles, topArticles] = await Promise.all([
    fetchLatestAINews(40),
    fetchTopThisWeek(3),
  ]);

  const finalArticles = newsArticles.length > 0 ? newsArticles : STATIC_NEWS_ARTICLES;
  const finalTop = topArticles.length > 0 ? topArticles : STATIC_NEWS_ARTICLES.slice(0, 3);

  return <NewsClient newsArticles={finalArticles} topArticles={finalTop} />;
}
