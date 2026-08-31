/** One row in the tool_clicks table */
export interface ToolClick {
  id: string;
  tool_slug: string;
  tool_name: string;
  referrer_path: string | null;
  user_agent: string | null;
  clicked_at: string; // ISO timestamp
}

/** Aggregated result from getTopClickedTools() */
export interface ToolClickCount {
  tool_slug: string;
  tool_name: string;
  click_count: number;
}

/** Payload accepted by POST /api/track */
export interface TrackClickPayload {
  slug: string;
  tool_name: string;
  referrer_path?: string;
  user_agent?: string;
}
