-- ============================================================
-- Migration: 002_create_tool_clicks
-- Stores every outbound click through /go/[slug].
-- Run this in Supabase SQL Editor after 001_create_tool_affiliates.sql
-- ============================================================

CREATE TABLE IF NOT EXISTS tool_clicks (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Tool identity (denormalized — no FK needed, clicks are immutable logs)
  tool_slug        text NOT NULL,
  tool_name        text NOT NULL,

  -- Context
  referrer_path    text,          -- the ToolStaq page that sent the user, e.g. '/tools/heygen'
  user_agent       text,          -- first 200 chars of UA string

  -- Timestamp (immutable — no updated_at)
  clicked_at       timestamptz NOT NULL DEFAULT now()
);

-- ── Indexes ──────────────────────────────────────────────────
-- Leaderboard: GROUP BY tool_slug ORDER BY count DESC
CREATE INDEX IF NOT EXISTS tool_clicks_slug_idx
  ON tool_clicks (tool_slug);

-- Time-range queries: clicks in the last 7 / 30 / 90 days
CREATE INDEX IF NOT EXISTS tool_clicks_clicked_at_idx
  ON tool_clicks (clicked_at DESC);

-- Combined for per-tool time-range queries
CREATE INDEX IF NOT EXISTS tool_clicks_slug_time_idx
  ON tool_clicks (tool_slug, clicked_at DESC);

-- ── Row Level Security ────────────────────────────────────────
ALTER TABLE tool_clicks ENABLE ROW LEVEL SECURITY;

-- Public has NO read access — click data is internal only.
-- Service role bypasses RLS and handles all inserts + reads.

-- ── Comments ─────────────────────────────────────────────────
COMMENT ON TABLE tool_clicks IS
  'Immutable log of every outbound click through /go/[slug]. One row per click. Internal only.';
COMMENT ON COLUMN tool_clicks.referrer_path IS
  'The ToolStaq page path that initiated the click, e.g. /tools/heygen or /category/ai-video.';
COMMENT ON COLUMN tool_clicks.user_agent IS
  'Truncated user-agent string. Bots are filtered before insert.';
