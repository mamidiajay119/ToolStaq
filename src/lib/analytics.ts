import { getServiceRoleClient } from './supabase';
import type { ToolClick, ToolClickCount } from '@/types/analytics';

/**
 * Returns the top N most-clicked tools (all-time).
 * Uses a raw SQL aggregate since Supabase JS client doesn't support
 * GROUP BY + COUNT natively in a fluent way.
 */
export async function getTopClickedTools(limit = 20): Promise<ToolClickCount[]> {
  const client = getServiceRoleClient();

  const { data, error } = await client.rpc('get_top_clicked_tools', { p_limit: limit });

  if (error) {
    console.error('[analytics] getTopClickedTools:', error.message);
    return [];
  }
  return (data ?? []) as ToolClickCount[];
}

/**
 * Returns total click count for a single tool.
 * @param slug - tool slug
 * @param days - lookback window in days (default: all-time)
 */
export async function getClicksForTool(
  slug: string,
  days?: number
): Promise<number> {
  const client = getServiceRoleClient();

  let query = client
    .from('tool_clicks')
    .select('id', { count: 'exact', head: true })
    .eq('tool_slug', slug);

  if (days) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    query = query.gte('clicked_at', since);
  }

  const { count, error } = await query;

  if (error) {
    console.error(`[analytics] getClicksForTool(${slug}):`, error.message);
    return 0;
  }
  return count ?? 0;
}

/**
 * Returns raw click rows for a tool (most recent first).
 * Useful for debugging or detailed per-tool analytics.
 */
export async function getRecentClicksForTool(
  slug: string,
  limit = 50
): Promise<ToolClick[]> {
  const client = getServiceRoleClient();

  const { data, error } = await client
    .from('tool_clicks')
    .select('*')
    .eq('tool_slug', slug)
    .order('clicked_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`[analytics] getRecentClicksForTool(${slug}):`, error.message);
    return [];
  }
  return (data ?? []) as ToolClick[];
}
