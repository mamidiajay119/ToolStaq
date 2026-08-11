import type { Metadata } from 'next';
import { Calendar, Clock } from 'lucide-react';
import { fetchLatestAINews } from '@/lib/news';
import NewsletterForm from '@/components/news/NewsletterForm';

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
  let newsArticles = await fetchLatestAINews(6);

  // If fetching fails or API is not set, fallback to static curated articles
  if (!newsArticles || newsArticles.length === 0) {
    newsArticles = STATIC_NEWS_ARTICLES;
  }

  return (
    <>
      <style>{`
        .news-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.75rem;
          display: flex;
          flex-direction: column;
          gap: 16px;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
          cursor: pointer;
          text-decoration: none;
        }
        .news-card:hover {
          border-color: rgba(249, 115, 22, 0.35) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        .featured-card {
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 3rem;
          text-decoration: none;
          transition: transform 150ms ease, border-color 150ms ease, box-shadow 150ms ease;
        }
        .featured-card:hover {
          border-color: rgba(249, 115, 22, 0.35) !important;
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
        @media (min-width: 900px) {
          .featured-card {
            flex-direction: row;
            align-items: center;
            gap: 40px;
          }
        }
        .news-grid {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 5rem;
        }
        @media (min-width: 768px) {
          .news-card {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
          }
          .news-card-content {
            flex: 1;
            min-width: 0;
          }
          .news-card-meta {
            flex-direction: column !important;
            align-items: flex-end;
            gap: 6px !important;
          }
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '2rem', paddingBottom: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ paddingBottom: '1.5rem', marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.03em', marginBottom: '4px' }}>AI News</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Latest breakthroughs, model releases, and engineering trends.
          </p>
        </div>

        {/* Recent News Grid */}
        <div className="news-grid">
          {newsArticles.map((article) => (
            <a 
              key={article.id} 
              href={article.url || `/news/${article.slug}`} 
              target={article.url ? "_blank" : undefined}
              rel={article.url ? "noopener noreferrer" : undefined}
              className="news-card"
            >
              <div className="news-card-content" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="badge badge-slate" style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: '6px' }}>
                    {article.category}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {article.source}
                  </span>
                </div>
                
                <h3 style={{
                  fontSize: '1.15rem',
                  fontWeight: 500,
                  color: 'var(--text-primary)',
                  lineHeight: 1.4,
                  margin: 0,
                }}>
                  {article.title}
                </h3>
                
                <p style={{
                  fontSize: '0.825rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.5,
                  margin: 0,
                  maxWidth: '720px',
                }}>
                  {article.excerpt}
                </p>
              </div>

              <div className="news-card-meta" style={{
                display: 'flex',
                gap: '16px',
                fontSize: '0.725rem',
                color: 'var(--text-muted)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <Calendar size={12} /> {article.date}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>
                  <Clock size={12} /> {article.readTime}
                </span>
              </div>
            </a>
          ))}
        </div>

        {/* Newsletter Section */}
        <section style={{ marginTop: '2rem' }}>
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '3rem 2rem',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '-50px',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-50px',
              right: '-50px',
              width: '180px',
              height: '180px',
              background: 'radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%)',
              filter: 'blur(30px)',
              pointerEvents: 'none',
            }} />
            
            <h2 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '0.75rem', letterSpacing: '-0.01em' }}>
              Subscribe to AI Updates
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.75rem', maxWidth: '460px', margin: '0 auto 1.75rem', lineHeight: 1.5 }}>
              Get a weekly summary of the most important AI tool launches and news stories sent straight to your inbox.
            </p>
            
            <NewsletterForm />
          </div>
        </section>

      </div>
    </>
  );
}
