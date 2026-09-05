import type { Tool } from '@/types/tool';
import { supabase } from './supabase';

export const STATIC_CATEGORIES = [
  "AI 3D Design",
  "AI Academic Research",
  "AI Analytics",
  "AI App & Web Builder",
  "AI App Builder",
  "AI Audio",
  "AI Automation",
  "AI Browser Sidebars",
  "AI Chat",
  "AI Chatbot",
  "AI Chatbots & Virtual Assistants",
  "AI Coding",
  "AI Coding Assistant",
  "AI Companion",
  "AI Content Creation",
  "AI Copywriting & Marketing",
  "AI Creative & Story Writing",
  "AI Creative Tools",
  "AI Customer Support",
  "AI Cybersecurity",
  "AI Data Extraction",
  "AI Design",
  "AI Design Tool",
  "AI Developer API",
  "AI Developer Platform",
  "AI Developer Tools",
  "AI Document Intelligence",
  "AI Education",
  "AI Education & Tutoring",
  "AI Email & Inbox",
  "AI Enterprise Search",
  "AI Enterprise Tools",
  "AI Entertainment",
  "AI Finance",
  "AI Finance & Accounting",
  "AI Fitness & Health",
  "AI Forms & Surveys",
  "AI Governance",
  "AI HR",
  "AI HR & Recruiting",
  "AI Headshots & Avatars",
  "AI Healthcare",
  "AI Healthcare & Medical",
  "AI Image",
  "AI Image Generation",
  "AI Industrial & Engineering",
  "AI Infrastructure",
  "AI Interior Design",
  "AI Legal",
  "AI Legal & Compliance",
  "AI Life Coaching",
  "AI Lifestyle",
  "AI Marketing",
  "AI Meeting Notes",
  "AI Mental Health & Wellness",
  "AI Music Generation",
  "AI Observability & Evaluation",
  "AI Operations",
  "AI Photo Culling & Retouching",
  "AI Photo Editing",
  "AI Presentation",
  "AI Presentations & Slides",
  "AI Product Management",
  "AI Productivity",
  "AI Reasoning Model",
  "AI Research",
  "AI Research Tools",
  "AI Roleplay & Companions",
  "AI SEO & Blog Writing",
  "AI Sales",
  "AI Sales & SDRs",
  "AI Security",
  "AI Social Media",
  "AI Spreadsheets & Data",
  "AI Storyboarding & Comics",
  "AI Text Humanizer",
  "AI Translation",
  "AI UI Generator",
  "AI Vector Databases",
  "AI Video",
  "AI Video Editing",
  "AI Video Generation",
  "AI Voice & Audio",
  "AI Website Builder",
  "AI Workflow Automation",
  "AI Workload Automation",
  "AI Writing",
  "Developer API",
  "Developer Platform",
  "Enterprise AI Platform",
  "Foundation Model",
  "Multi-Model Platform",
  "No-Code Platform",
  "On-Device AI",
  "Open-Source LLM",
  "Web Scraping Tool"
];

// Keep static metadata synchronous for client layouts (Footer, etc.)
export function getMeta() {
  return {
    total: 2729,
    categories: 96,
    generated: '2026-08-23T18:00:00Z'
  };
}

export function getAllCategories(): string[] {
  return STATIC_CATEGORIES;
}

// Helper to defensively normalize all array fields to empty arrays to prevent crashes in client code
function normalizeTool(t: any): Tool {
  return {
    ...t,
    tool_name: (t.tool_name || '').replace(/\s*\([^)]+\)$/i, '').trim(),
    category: t.category || [],
    features: t.features || [],
    target_segment: t.target_segment || [],
    target_user_persona: t.target_user_persona || [],
    best_for: t.best_for || [],
    not_suitable_for: t.not_suitable_for || [],
    core_features: t.core_features || [],
    integrations: t.integrations || [],
    alternatives: t.alternatives || []
  };
}

// Database-backed async functions for Server Components
// Cached to prevent redundant Supabase round-trips across the same request and between renders
async function fetchAllToolsRaw(): Promise<Tool[]> {
  let allDbTools: any[] = [];
  let from = 0;
  const step = 1000;
  let hasMore = true;

  while (hasMore) {
    const { data: chunk, error } = await supabase
      .from('tools')
      .select('*')
      .order('tool_name', { ascending: true })
      .range(from, from + step - 1);

    if (error) {
      console.error('Error fetching tools chunk from Supabase:', error.message);
      return [];
    }

    if (!chunk || chunk.length === 0) {
      hasMore = false;
    } else {
      allDbTools = [...allDbTools, ...chunk];
      if (chunk.length < step) {
        hasMore = false;
      } else {
        from += step;
      }
    }
  }

  return allDbTools.map(normalizeTool);
}

// Plain export — getAllTools is only called from SSG pages (/, /tools, /categories)
// which are statically pre-rendered at build time. No runtime caching needed.
export async function getAllTools(): Promise<Tool[]> {
  return fetchAllToolsRaw();
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const { data: dbTool, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching tool by slug ${slug} from Supabase:`, error.message);
    return undefined;
  }
  return dbTool ? normalizeTool(dbTool) : undefined;
}

// Targeted lookup by tool_name — used for alternatives panel on detail pages.
// Avoids fetching all 2,669 tools just to find 3 alternatives.
export async function getToolsByNames(names: string[]): Promise<Tool[]> {
  if (!names || names.length === 0) return [];
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .in('tool_name', names);

  if (error) {
    console.error('Error fetching tools by names from Supabase:', error.message);
    return [];
  }
  return (data || []).map(normalizeTool);
}

export async function getToolsByCategory(categoryOrSlug: string): Promise<Tool[]> {
  const targetSlug = slugifyCategory(categoryOrSlug);
  const allTools = await getAllTools();

  return allTools.filter((t) => {
    const primarySlug = slugifyCategory(t.primary_category || '');
    if (primarySlug === targetSlug) return true;
    return (t.category || []).some((c) => slugifyCategory(c) === targetSlug);
  });
}

export async function getAllCategoriesAsync(): Promise<string[]> {
  const counts = await getCategoryCounts();
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const tools = await getAllTools();
  const counts: Record<string, number> = {};
  tools.forEach((t) => {
    const categoriesSet = new Set([
      ...(t.category || []),
      ...(t.primary_category ? [t.primary_category] : []),
    ]);
    categoriesSet.forEach((c) => {
      counts[c] = (counts[c] || 0) + 1;
    });
  });
  return counts;
}

export async function getAllSlugs(): Promise<string[]> {
  const { data: slugs, error } = await supabase
    .from('tools')
    .select('slug');

  if (error) {
    console.error('Error fetching slugs from Supabase:', error.message);
    return [];
  }
  return slugs.map((s) => s.slug);
}

export async function getFeaturedTools(count = 8): Promise<Tool[]> {
  const { data: dbTools, error } = await supabase
    .from('tools')
    .select('*')
    .order('is_recommended', { ascending: false })
    .order('is_new', { ascending: false })
    .limit(count);

  if (error) {
    console.error('Error fetching featured tools from Supabase:', error.message);
    return [];
  }
  return (dbTools || []).map(normalizeTool);
}

export async function searchTools(query: string): Promise<Tool[]> {
  if (!query.trim()) return getAllTools();
  const q = query.toLowerCase();
  
  const allTools = await getAllTools();
  return allTools.filter(
    (t) =>
      t.tool_name.toLowerCase().includes(q) ||
      t.primary_category.toLowerCase().includes(q) ||
      t.category.some((c) => c.toLowerCase().includes(q)) ||
      t.best_for.some((b) => b.toLowerCase().includes(q)) ||
      t.decision_summary?.toLowerCase().includes(q)
  );
}

// Synchronous string utility helpers
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
  return cat
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function categoryFromSlug(slug: string, allTools?: Tool[]): string {
  const targetSlug = slugifyCategory(slug);

  if (allTools && allTools.length > 0) {
    for (const t of allTools) {
      if (t.primary_category && slugifyCategory(t.primary_category) === targetSlug) {
        return t.primary_category;
      }
      const matched = (t.category || []).find((c) => slugifyCategory(c) === targetSlug);
      if (matched) return matched;
    }
  }

  const staticCategories = getAllCategories();
  const found = staticCategories.find((c) => slugifyCategory(c) === targetSlug);
  if (found) return found;

  return slug
    .replace(/--+/g, '-')
    .split('-')
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (['AI', 'API', 'HR', 'SEO', 'UI', 'UX', '3D', 'LLM', 'IDE'].includes(upper)) {
        return upper;
      }
      if (word === 'and') return '&';
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

export function getInitialUpvotes(slug: string, isRecommended?: boolean): number {
  return 0; // All tools start at 0
}

const GENERIC_DESCRIPTIONS = new Set([
  'Writing long-form SEO blog articles',
]);

export function getToolDescription(tool: Tool): string {
  const desc = tool.description || '';
  if (desc && !GENERIC_DESCRIPTIONS.has(desc) && desc.length >= 20) {
    return desc;
  }
  
  const cleanBestFor = (tool.best_for || []).filter((b) => !GENERIC_DESCRIPTIONS.has(b));
  if (cleanBestFor.length > 0) {
    return cleanBestFor[0];
  }
  
  if (tool.core_features && tool.core_features.length > 0) {
    const feature = tool.core_features.find((f) => f.length >= 30);
    if (feature) return feature.trim();
  }
  
  return `${tool.tool_name} is an AI-powered tool in the ${tool.primary_category} category.`;
}
