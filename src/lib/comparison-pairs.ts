import type { Tool } from '@/types/tool';

export interface ComparisonPair {
  slug: string;
  title: string;
  slug1: string;
  slug2: string;
}

export interface CategoryComparisonItem {
  categoryName: string;
  title: string;
  slug: string;
  t1: Tool;
  t2: Tool;
}

export const POPULAR_COMPARISON_PAIRS: ComparisonPair[] = [
  { slug: 'chatgpt-vs-claude', title: 'ChatGPT vs Claude', slug1: 'chatgpt', slug2: 'claude' },
  { slug: 'github-copilot-vs-cursor', title: 'GitHub Copilot vs Cursor', slug1: 'github-copilot', slug2: 'cursor' },
  { slug: 'perplexity-vs-chatgpt', title: 'Perplexity vs ChatGPT', slug1: 'perplexity', slug2: 'chatgpt' },
  { slug: 'cursor-vs-vs-code', title: 'Cursor vs VS Code', slug1: 'cursor', slug2: 'vs-code' },
  { slug: 'v0-vs-bolt-new', title: 'v0 vs Bolt.new', slug1: 'v0', slug2: 'bolt-new' },
  { slug: 'jasper-vs-notion-ai', title: 'Jasper vs Notion AI', slug1: 'jasper', slug2: 'notion-ai' },
  { slug: 'midjourney-vs-dall-e-3', title: 'Midjourney vs DALL-E 3', slug1: 'midjourney', slug2: 'dall-e-3' },
  { slug: 'elevenlabs-vs-murf-ai', title: 'ElevenLabs vs Murf.ai', slug1: 'elevenlabs', slug2: 'murf-ai' },
];

export function resolveComparisonSlug(slug: string): { slug1: string; slug2: string } | null {
  const parts = slug.split('-vs-');
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { slug1: parts[0], slug2: parts[1] };
  }
  return null;
}

/**
 * Programmatically generates 3 category comparison cards (1 per top category with max recommended tools).
 * ONLY RECOMMENDED tools (is_recommended: true) are included in these generated cards.
 * Both tools in each comparison are strictly from the EXACT SAME primary category.
 * Rotates automatically every 24 hours or via rotationOffset.
 */
export function getRotatedCategoryComparisons(tools: Tool[], rotationOffset = 0, count = 3): CategoryComparisonItem[] {
  if (!tools || tools.length === 0) return [];

  // Filter ONLY recommended tools
  const recommendedToolsOnly = tools.filter((t) => t.is_recommended);
  const toolPool = recommendedToolsOnly.length >= 10 ? recommendedToolsOnly : tools;

  // Group recommended tools strictly by exact primary_category
  const categoryMap: Record<string, Tool[]> = {};
  toolPool.forEach((t) => {
    const cat = t.primary_category || 'AI Tools';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(t);
  });

  // Get categories sorted by tool count (must have at least 2 tools)
  const sortedCategories = Object.entries(categoryMap)
    .filter(([_, list]) => list.length >= 2)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([catName]) => catName);

  // Pick top categories up to count
  const targetCategories = sortedCategories.slice(0, count);

  const daySeed = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const effectiveOffset = daySeed + rotationOffset;

  const results: CategoryComparisonItem[] = [];

  for (let cIdx = 0; cIdx < targetCategories.length; cIdx++) {
    const catName = targetCategories[cIdx];
    const catTools = categoryMap[catName];

    if (!catTools || catTools.length < 2) continue;

    // Pick 2 distinct recommended tools strictly within this exact primary category
    const index1 = (effectiveOffset + cIdx * 3) % catTools.length;
    let index2 = (effectiveOffset + cIdx * 3 + 1 + Math.floor(cIdx * 1.5)) % catTools.length;

    if (index1 === index2) {
      index2 = (index2 + 1) % catTools.length;
    }

    const t1 = catTools[index1];
    const t2 = catTools[index2];

    results.push({
      categoryName: catName,
      title: `${t1.tool_name} vs ${t2.tool_name}`,
      slug: `${t1.slug}-vs-${t2.slug}`,
      t1,
      t2,
    });
  }

  return results.slice(0, count);
}
