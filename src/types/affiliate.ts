export interface ToolAffiliate {
  id: string;
  tool_slug: string;
  tool_name: string;
  url: string;

  // Core affiliate fields
  affiliate_link: string | null;
  network: string | null;
  commission: string | null;         // human-readable, e.g. "30% recurring"

  // Optional enrichment
  commission_type: 'percentage' | 'flat' | 'recurring' | 'tiered' | null;
  commission_rate: number | null;    // numeric rate for filtering/sorting
  cookie_duration_days: number | null;
  payout_threshold_usd: number | null;
  payout_methods: string[] | null;

  // Lifecycle
  status: 'active' | 'pending' | 'applied' | 'inactive' | 'rejected';
  notes: string | null;
  verified_at: string | null;

  created_at: string;
  updated_at: string;
}

/** Lightweight type used for display on tool detail pages */
export interface ToolAffiliateDisplay {
  affiliate_link: string;
  network: string | null;
  commission: string | null;
}
