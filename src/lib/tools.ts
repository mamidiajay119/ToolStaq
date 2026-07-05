import toolsData from '../../public/data/tools.json';
import type { Tool, ToolsData } from '@/types/tool';

const data = toolsData as ToolsData;

export function getAllTools(): Tool[] {
  return data.tools;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return data.tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: string): Tool[] {
  return data.tools.filter((t) =>
    t.category.some((c) => c.toLowerCase() === category.toLowerCase())
  );
}

export function getAllCategories(): string[] {
  return Object.keys(data.category_counts).sort((a, b) => data.category_counts[b] - data.category_counts[a]);
}

export function getCategoryCounts(): Record<string, number> {
  return data.category_counts;
}

export function getAllSlugs(): string[] {
  return data.tools.map((t) => t.slug);
}

export function getMeta() {
  return data.meta;
}

export function getFeaturedTools(count = 8): Tool[] {
  // Return tools that have the most data filled in (proxy for "quality")
  return data.tools
    .filter((t) => t.core_features.length > 0 && t.best_for.length > 0)
    .slice(0, count);
}

export function searchTools(query: string): Tool[] {
  if (!query.trim()) return data.tools;
  const q = query.toLowerCase();
  return data.tools.filter(
    (t) =>
      t.tool_name.toLowerCase().includes(q) ||
      t.primary_category.toLowerCase().includes(q) ||
      t.category.some((c) => c.toLowerCase().includes(q)) ||
      t.best_for.some((b) => b.toLowerCase().includes(q)) ||
      t.decision_summary.toLowerCase().includes(q)
  );
}

/**
 * Known generic/corrupted values that were produced by over-eager keyword matching
 * in the scraper. We treat these as "no description" and fall back to richer text.
 */
const GENERIC_DESCRIPTIONS = new Set([
  'Writing long-form SEO blog articles',
]);

/**
 * Returns a clean, unique description for a tool to show in cards and detail pages.
 * Priority:
 *  1. tool.description — the newly scraped/enriched description (if valid)
 *  2. best_for[0] — if it's not one of the known bad generic values
 *  3. First non-trivial core_feature (≥ 30 chars, trimmed)
 *  4. Category-aware fallback sentence
 */
export function getToolDescription(tool: Tool): string {
  // 0. AI-generated long description (highest quality)
  if ((tool as any).long_description?.trim().length > 20) {
    return (tool as any).long_description.trim();
  }

  // 1. New description column (if it exists and is not just whitespace)
  if (tool.description && tool.description.trim().length > 10) {
    return tool.description.trim();
  }

  // 2. Use best_for[0] if it's genuine
  const bf0 = tool.best_for[0];
  if (bf0 && !GENERIC_DESCRIPTIONS.has(bf0)) {
    return bf0;
  }

  // 2. Find first good-quality feature (not scraped nav text)
  const goodFeature = tool.core_features.find(
    (f) => f.length >= 30 && f.length <= 160 && !f.toLowerCase().includes('sign up') && !f.toLowerCase().includes('login')
  );
  if (goodFeature) {
    // Clean up: trim to first sentence if possible
    const sentence = goodFeature.split(/[.!?]/)[0].trim();
    if (sentence.length >= 20) return sentence;
  }

  // 3. Find a non-corrupted best_for entry (skip only the first if bad)
  if (GENERIC_DESCRIPTIONS.has(bf0 ?? '')) {
    const nextGood = tool.best_for.slice(1).find((b) => !GENERIC_DESCRIPTIONS.has(b));
    if (nextGood) return nextGood;
  }

  // 4. Category-aware fallback
  const catDescriptions: Record<string, string> = {
    'AI Writing':          `${tool.tool_name} is an AI-powered writing and content creation tool.`,
    'AI Coding':           `${tool.tool_name} is an AI coding assistant for developers.`,
    'AI Video':            `${tool.tool_name} is an AI video generation and editing platform.`,
    'AI Audio':            `${tool.tool_name} is an AI audio and voice generation tool.`,
    'AI Design':           `${tool.tool_name} is an AI-powered design and image creation tool.`,
    'AI Research':         `${tool.tool_name} is an AI research and knowledge discovery platform.`,
    'AI Automation':       `${tool.tool_name} automates workflows using AI.`,
    'AI Productivity':     `${tool.tool_name} boosts productivity with AI assistance.`,
    'AI Analytics':        `${tool.tool_name} delivers AI-powered analytics and business insights.`,
    'AI Customer Support': `${tool.tool_name} automates customer support with AI.`,
    'AI Sales':            `${tool.tool_name} accelerates sales workflows with AI.`,
    'AI Marketing':        `${tool.tool_name} is an AI marketing and campaign optimization tool.`,
    'AI HR':               `${tool.tool_name} streamlines HR and hiring with AI.`,
    'AI Education':        `${tool.tool_name} is an AI-powered learning and education platform.`,
    'AI Legal':            `${tool.tool_name} helps legal teams with AI-powered document analysis.`,
    'AI Finance':          `${tool.tool_name} automates financial workflows using AI.`,
    'AI Healthcare':       `${tool.tool_name} supports healthcare workflows with AI.`,
    'AI Translation':      `${tool.tool_name} provides AI-powered translation and localization.`,
    'AI Image':            `${tool.tool_name} generates and edits images with AI.`,
    'AI Chat':             `${tool.tool_name} is an AI chat and conversational assistant.`,
    'AI Security':         `${tool.tool_name} delivers AI-powered cybersecurity capabilities.`,
    'AI Data Extraction':  `${tool.tool_name} extracts structured data from unstructured sources using AI.`,
    'AI Presentation':     `${tool.tool_name} generates presentations and slide decks with AI.`,
    'AI Social Media':     `${tool.tool_name} manages and optimizes social media content with AI.`,
    'AI Voice':            `${tool.tool_name} is an AI voice synthesis and cloning tool.`,
    'AI Avatar':           `${tool.tool_name} creates AI avatar and digital spokesperson videos.`,
    'AI Search':           `${tool.tool_name} enables AI-powered semantic search.`,
  };
  return catDescriptions[tool.primary_category] ?? `${tool.tool_name} is an AI-powered tool in the ${tool.primary_category} category.`;
}

export function getPricingLabel(tool: Tool): string {
  if (tool.free_trial && tool.pricing_model === 'freemium') return 'Free';
  if (tool.free_trial) return 'Free Trial';
  if (tool.starting_price_usd) return `From $${tool.starting_price_usd}/mo`;
  const labels: Record<string, string> = {
    freemium: 'Freemium',
    subscription: 'Subscription',
    'usage-based': 'Usage-Based',
    'one-time': 'One-Time',
    'custom pricing': 'Custom',
  };
  return labels[tool.pricing_model] || tool.pricing_model || 'Pricing varies';
}


export function slugifyCategory(cat: string): string {
  return cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function categoryFromSlug(slug: string): string {
  return getAllCategories().find(
    (c) => slugifyCategory(c) === slug
  ) || slug;
}
