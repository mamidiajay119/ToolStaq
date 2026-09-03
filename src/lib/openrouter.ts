export interface OpenRouterModel {
  id: string;
  name: string;
  created: number;
  description?: string;
  context_length?: number;
  architecture?: {
    modality?: string;
    tokenizer?: string;
    instruct_type?: string;
  };
  pricing?: {
    prompt?: string;
    completion?: string;
    image?: string;
    request?: string;
  };
}

export async function fetchLiveModelsByProvider(openrouterId: string): Promise<OpenRouterModel[]> {
  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      next: { revalidate: 86400 }, // Cache live models for 24 hours (1 call per day ISR)
    });
    if (!res.ok) return [];

    const data = await res.json();
    const allModels: OpenRouterModel[] = data?.data || [];

    const prefix = `${openrouterId.toLowerCase()}/`;

    return allModels
      .filter((m) => m.id.toLowerCase().startsWith(prefix))
      .sort((a, b) => (b.created || 0) - (a.created || 0));
  } catch (error) {
    console.error(`Error fetching OpenRouter models for ${openrouterId}:`, error);
    return [];
  }
}
