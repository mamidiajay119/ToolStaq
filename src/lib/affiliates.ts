import { supabase, getServiceRoleClient } from './supabase';
import type { ToolAffiliate, ToolAffiliateDisplay } from '@/types/affiliate';

/**
 * Fetch the active affiliate program for a single tool.
 * Used on tool detail pages — returns null if no active program exists.
 */
export async function getToolAffiliate(
  toolSlug: string
): Promise<ToolAffiliateDisplay | null> {
  const { data, error } = await supabase
    .from('tool_affiliates')
    .select('affiliate_link, network, commission')
    .eq('tool_slug', toolSlug)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error(`[affiliates] getToolAffiliate(${toolSlug}):`, error.message);
    return null;
  }
  return data ?? null;
}

/**
 * Fetch all active affiliate programs.
 * Useful for building an affiliate directory page or sitemap.
 */
export async function getAllActiveAffiliates(): Promise<ToolAffiliate[]> {
  const { data, error } = await supabase
    .from('tool_affiliates')
    .select('*')
    .eq('status', 'active')
    .order('tool_name', { ascending: true });

  if (error) {
    console.error('[affiliates] getAllActiveAffiliates:', error.message);
    return [];
  }
  return (data ?? []) as ToolAffiliate[];
}

/**
 * Fetch all affiliates regardless of status.
 * Admin / internal use only — requires service_role key.
 */
export async function getAllAffiliatesAdmin(): Promise<ToolAffiliate[]> {
  const client = getServiceRoleClient();
  const { data, error } = await client
    .from('tool_affiliates')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[affiliates] getAllAffiliatesAdmin:', error.message);
    return [];
  }
  return (data ?? []) as ToolAffiliate[];
}

/**
 * Upsert a single affiliate record.
 * Matches on tool_slug (unique). Creates or updates.
 * Requires service_role key.
 */
export async function upsertAffiliate(
  record: Omit<ToolAffiliate, 'id' | 'created_at' | 'updated_at'>
): Promise<{ error: string | null }> {
  const client = getServiceRoleClient();
  const { error } = await client
    .from('tool_affiliates')
    .upsert(record, { onConflict: 'tool_slug' });

  if (error) {
    console.error('[affiliates] upsertAffiliate:', error.message);
    return { error: error.message };
  }
  return { error: null };
}

/**
 * Bulk upsert from an array of records.
 * Used by the CSV/Excel upload script.
 */
export async function bulkUpsertAffiliates(
  records: Omit<ToolAffiliate, 'id' | 'created_at' | 'updated_at'>[]
): Promise<{ inserted: number; error: string | null }> {
  if (!records.length) return { inserted: 0, error: null };

  const client = getServiceRoleClient();
  const { error } = await client
    .from('tool_affiliates')
    .upsert(records, { onConflict: 'tool_slug' });

  if (error) {
    console.error('[affiliates] bulkUpsertAffiliates:', error.message);
    return { inserted: 0, error: error.message };
  }
  return { inserted: records.length, error: null };
}
