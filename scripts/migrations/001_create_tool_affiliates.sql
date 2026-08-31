-- ============================================================
-- Migration: 001_create_tool_affiliates
-- Creates the tool_affiliates table for affiliate program data.
-- Run this once in Supabase SQL Editor (or via Supabase CLI).
-- ============================================================

CREATE TABLE IF NOT EXISTS tool_affiliates (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tool identity (mirrors tools table for easy standalone queries)
  tool_slug             text NOT NULL,          -- FK to tools.slug
  tool_name             text NOT NULL,          -- denormalized for quick display
  url                   text NOT NULL,          -- canonical tool website URL

  -- Affiliate program details
  affiliate_link        text,                   -- your tracking / referral URL
  network               text,                   -- e.g. 'Impact', 'ShareASale', 'PartnerStack', 'Direct'
  commission            text,                   -- human-readable, e.g. '30% recurring' or '$50 flat'

  -- Optional enrichment (fill as discovered)
  commission_type       text,                   -- 'percentage' | 'flat' | 'recurring' | 'tiered'
  commission_rate       numeric(6,2),           -- numeric rate, e.g. 30.00 for 30%
  cookie_duration_days  integer,                -- e.g. 90
  payout_threshold_usd  numeric(10,2),          -- minimum payout amount
  payout_methods        text[],                 -- e.g. '{"PayPal","Bank Transfer"}'

  -- Lifecycle
  status                text NOT NULL DEFAULT 'pending',
                        -- 'active' | 'pending' | 'applied' | 'inactive' | 'rejected'
  notes                 text,                   -- internal notes, terms, contact info
  verified_at           timestamptz,            -- when affiliate link was confirmed working

  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────
-- One affiliate program per tool (adjust to non-unique if you want multi-network)
CREATE UNIQUE INDEX IF NOT EXISTS tool_affiliates_slug_uidx
  ON tool_affiliates (tool_slug);

CREATE INDEX IF NOT EXISTS tool_affiliates_status_idx
  ON tool_affiliates (status);

CREATE INDEX IF NOT EXISTS tool_affiliates_network_idx
  ON tool_affiliates (network);

-- ── Foreign Key (optional but recommended) ───────────────────
-- Uncomment if your tools table has an accessible slug PK/unique constraint:
-- ALTER TABLE tool_affiliates
--   ADD CONSTRAINT fk_tool_affiliates_slug
--   FOREIGN KEY (tool_slug) REFERENCES tools(slug) ON DELETE CASCADE;

-- ── Auto-update updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_tool_affiliates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_tool_affiliates_updated_at ON tool_affiliates;
CREATE TRIGGER trg_tool_affiliates_updated_at
  BEFORE UPDATE ON tool_affiliates
  FOR EACH ROW EXECUTE FUNCTION update_tool_affiliates_updated_at();

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE tool_affiliates ENABLE ROW LEVEL SECURITY;

-- Public can read active affiliate records (for display on site)
CREATE POLICY "Public read active affiliates"
  ON tool_affiliates FOR SELECT
  USING (status = 'active');

-- Service role (used by upload scripts / admin) has full access via RLS bypass
-- No additional policy needed — service_role bypasses RLS by default.

-- ── Comments ──────────────────────────────────────────────────
COMMENT ON TABLE tool_affiliates IS
  'Affiliate program data for AI tools. One row per tool. Populated manually as programs are discovered.';
COMMENT ON COLUMN tool_affiliates.commission IS
  'Human-readable commission string, e.g. "30% recurring", "$50 per sale". For display.';
COMMENT ON COLUMN tool_affiliates.commission_rate IS
  'Numeric commission rate (percentage or flat USD) for filtering/sorting.';
COMMENT ON COLUMN tool_affiliates.status IS
  'active=live on site | pending=researching | applied=waiting approval | inactive=program paused | rejected=not accepted';
