export interface Tool {
  slug: string;
  tool_name: string;
  url: string;
  category: string[];
  primary_category: string;
  icon: string;
  favicon_url?: string;
  title: string;
  description: string;
  features: string[];
  target_segment: string[];
  target_user_persona: string[];
  best_for: string[];
  not_suitable_for: string[];
  core_features: string[];
  integrations: string[];
  starting_price_usd: number | null;
  pricing_model: string;
  value_metric: string;
  time_to_value: string;
  complexity_level: string;
  deployment: string;
  has_api: boolean;
  free_trial: boolean;
  open_source: boolean;
  alternatives: string[];
  decision_summary: string;
}

export interface ToolsData {
  meta: {
    total: number;
    categories: number;
    generated: string;
  };
  category_counts: Record<string, number>;
  tools: Tool[];
}

export interface FilterState {
  search: string;
  categories: string[];
  pricing_models: string[];
  complexity: string[];
  deployment: string[];
  free_trial: boolean | null;
  has_api: boolean | null;
  open_source: boolean | null;
  segments: string[];
}
