import toolsData from '../../public/data/tools.json';
import type { Tool, ToolsData } from '@/types/tool';
import { supabase } from './supabase';

const data = toolsData as ToolsData;

// Keep static metadata synchronous for client layouts (Footer, etc.)
export function getMeta() {
  return data.meta;
}

export function getAllCategories(): string[] {
  return Object.keys(data.category_counts).sort((a, b) => data.category_counts[b] - data.category_counts[a]);
}

export function getCategoryCountsSync(): Record<string, number> {
  return data.category_counts;
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
  const { data: dbTools, error } = await supabase
    .from('tools')
    .select('*')
    .order('tool_name', { ascending: true });

  if (error) {
    console.error('Error fetching tools from Supabase:', error.message);
    return data.tools.map(normalizeTool); // Graceful static fallback
  }
  return (dbTools || []).map(normalizeTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | undefined> {
  const { data: dbTool, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error) {
    console.error(`Error fetching tool by slug ${slug} from Supabase:`, error.message);
    const fallback = data.tools.find((t) => t.slug === slug);
    return fallback ? normalizeTool(fallback) : undefined; // Graceful static fallback
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
    return data.tools
      .filter((t) => t.category.some((c) => c.toLowerCase() === category.toLowerCase()))
      .map(normalizeTool);
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
    return data.tools.map((t) => t.slug);
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
    // Static fallback
    return [...data.tools]
      .sort((a, b) => {
        const scoreA = (a.is_recommended ? 2 : 0) + (a.is_new ? 1 : 0);
        const scoreB = (b.is_recommended ? 2 : 0) + (b.is_new ? 1 : 0);
        return scoreB - scoreA;
      })
      .filter((t) => t.core_features.length > 0 && t.best_for.length > 0)
      .slice(0, count)
      .map(normalizeTool);
  }
  return (dbTools || []).map(normalizeTool);
}

export async function searchTools(query: string): Promise<Tool[]> {
  if (!query.trim()) return getAllTools();
  const q = query.toLowerCase();
  
  // Local filter over the full DB list (preserves complex fields search)
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
