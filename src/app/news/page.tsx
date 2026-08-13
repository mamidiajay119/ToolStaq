import type { Metadata } from 'next';
import { fetchLatestAINews } from '@/lib/news';
import NewsClient from './NewsClient';

export const metadata: Metadata = {
  title: 'AI News & Changelog — Latest Breakthroughs',
  description: 'Stay ahead of the curve with the latest news, releases, and trends in Artificial Intelligence. Curated by ToolStaq.',
};

// Cache the page for 7 days (weekly revalidation)
export const revalidate = 604800;

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
    slug: 'openai-announces-gpt-5'
  },
  {
    id: '2',
    title: 'Claude 3.8 Sonnet Sets New Benchmark for Multi-Modal Agents',
    excerpt: 'Anthropic’s latest release demonstrates massive gains in interactive browser use, tool execution, and visual document analysis, outperforming competitors in desktop-agent tasks.',
    date: 'July 15, 2026',
    readTime: '4 min read',
    category: 'AI Agents',
    source: 'Anthropic Blog',
    slug: 'claude-3-8-sonnet-benchmark'
  },
  {
    id: '3',
    title: 'Meta Releases Llama 4: The 405B Fully Open weights Giant',
    excerpt: 'Meta continues its commitment to open source AI by publishing Llama 4, matching proprietary models on coding, translation, and structured data extraction.',
    date: 'July 12, 2026',
    readTime: '6 min read',
    category: 'Open Source',
    source: 'Meta AI',
    slug: 'meta-releases-llama-4'
  },
  {
    id: '4',
    title: 'Next.js 16 Integrates Server Actions directly with Vercel AI SDK',
    excerpt: 'The newest release of Next.js simplifies streaming LLM responses, structured JSON parsing, and generative UI generation with deep framework integrations.',
    date: 'July 09, 2026',
    readTime: '3 min read',
    category: 'Web Dev',
    source: 'Vercel',
    slug: 'nextjs-16-vercel-ai-sdk'
  },
  {
    id: '5',
    title: 'AI Coding Tools See 300% Year-over-Year Enterprise Adoption',
    excerpt: 'A comprehensive market report reveals that over 80% of Fortune 500 companies have integrated AI assistants into their primary software engineering workflows.',
    date: 'July 05, 2026',
    readTime: '4 min read',
    category: 'Industry Trends',
    source: 'Gartner',
    slug: 'ai-coding-tools-enterprise-adoption'
  },
  {
    id: '6',
    title: 'EU AI Act Fully Enters Into Force: What Developers Need to Know',
    excerpt: 'As compliance rules become active, developers must audit their data pipelines, safety guardrails, and model validation methods to avoid heavy fines.',
    date: 'July 01, 2026',
    readTime: '5 min read',
    category: 'Regulation',
    source: 'EU Commission',
    slug: 'eu-ai-act-developers-compliance'
  }
];

export default async function NewsPage() {
  // Fetch latest automated news
  let newsArticles = await fetchLatestAINews(40);

  // If fetching fails or API is not set, fallback to static curated articles
  if (!newsArticles || newsArticles.length === 0) {
    newsArticles = STATIC_NEWS_ARTICLES;
  }

  return <NewsClient newsArticles={newsArticles} />;
}
