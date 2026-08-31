-- ============================================================
-- Migration: 003_add_analytics_rpc
-- Adds a Postgres function for the top-clicked-tools leaderboard.
-- Run after 002_create_tool_clicks.sql
-- ============================================================

CREATE OR REPLACE FUNCTION get_top_clicked_tools(p_limit integer DEFAULT 20)
RETURNS TABLE (
  tool_slug   text,
  tool_name   text,
  click_count bigint
)
LANGUAGE sql
SECURITY DEFINER   -- runs as the function owner (service role), not the caller
STABLE
AS $$
  SELECT
    tool_slug,
    tool_name,
    COUNT(*) AS click_count
  FROM tool_clicks
  GROUP BY tool_slug, tool_name
  ORDER BY click_count DESC
  LIMIT p_limit;
$$;

-- Grant execute to authenticated and anon roles so it can be called from
-- the service_role client (which bypasses RLS anyway).
GRANT EXECUTE ON FUNCTION get_top_clicked_tools(integer) TO authenticated, anon;

COMMENT ON FUNCTION get_top_clicked_tools IS
  'Returns the top N most-clicked tools across all time. Used for internal analytics leaderboard.';
