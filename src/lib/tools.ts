import type { Tool } from '@/types/tool';
import { supabase } from './supabase';

export const STATIC_CATEGORIES = [
  "AI Analytics",
  "AI Audio",
  "AI Automation",
  "AI Chat",
  "AI Coding",
  "AI Customer Support",
  "AI Data Extraction",
  "AI Design",
  "AI Education",
  "AI Finance",
  "AI HR",
  "AI Healthcare",
  "AI Image",
  "AI Legal",
  "AI Marketing",
  "AI Presentation",
  "AI Productivity",
  "AI Research",
  "AI Sales",
  "AI Security",
  "AI Social Media",
  "AI Translation",
  "AI Video",
  "AI Writing"
];

// Keep static metadata synchronous for client layouts (Footer, etc.)
export function getMeta() {
  return {
    total: 2669,
    categories: 24,
    generated: '2026-08-09T18:00:00Z'
  };
}

export function getAllCategories(): string[] {
  return STATIC_CATEGORIES;
}

// Helper to defensively normalize all array fields to empty arrays to prevent crashes in client code
function normalizeTool(t: any): Tool {
  return {
    ...t,
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
export async function getAllTools(): Promise<Tool[]> {
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

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const { data: dbTools, error } = await supabase
    .from('tools')
    .select('*')
    .contains('category', [category]); // Postgres array contains query

  if (error) {
    console.error(`Error fetching tools by category ${category} from Supabase:`, error.message);
    return [];
  }
  return (dbTools || []).map(normalizeTool);
}

export async function getAllCategoriesAsync(): Promise<string[]> {
  const counts = await getCategoryCounts();
  return Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const tools = await getAllTools();
  const counts: Record<string, number> = {};
  tools.forEach((t) => {
    t.category.forEach((c) => {
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
  return cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function categoryFromSlug(slug: string): string {
  const categories = getAllCategories();
  return categories.find((c) => slugifyCategory(c) === slug) || slug;
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
