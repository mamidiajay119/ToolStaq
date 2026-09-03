import { supabase } from './supabase';
import { getAllTools } from './tools';
import type { Tool } from '@/types/tool';

export interface Provider {
  slug: string;
  name: string;
  logo_url: string;
  website_url: string;
  openrouter_id: string;
  provider_type: 'frontier' | 'open-weight' | 'infrastructure' | 'specialized';
  description: string;
  headquarters: string;
}

export const FALLBACK_PROVIDERS: Provider[] = [
  {
    slug: 'openai',
    name: 'OpenAI',
    logo_url: 'https://a.favicon.im/openai.com?larger=true',
    website_url: 'https://openai.com',
    openrouter_id: 'openai',
    provider_type: 'frontier',
    description: 'AI research and deployment company behind GPT-4o, o3-mini, Sora, and ChatGPT.',
    headquarters: 'San Francisco, CA, USA',
  },
  {
    slug: 'anthropic',
    name: 'Anthropic',
    logo_url: 'https://a.favicon.im/anthropic.com?larger=true',
    website_url: 'https://anthropic.com',
    openrouter_id: 'anthropic',
    provider_type: 'frontier',
    description: 'AI safety and research company creating the Claude family of frontier intelligence models.',
    headquarters: 'San Francisco, CA, USA',
  },
  {
    slug: 'google',
    name: 'Google DeepMind',
    logo_url: 'https://a.favicon.im/deepmind.google?larger=true',
    website_url: 'https://deepmind.google',
    openrouter_id: 'google',
    provider_type: 'frontier',
    description: 'Google’s AI research arm developing Gemini 2.0 Flash, Imagen 3, Veo, and AlphaFold.',
    headquarters: 'London, UK & Mountain View, CA',
  },
  {
    slug: 'deepseek',
    name: 'DeepSeek',
    logo_url: 'https://a.favicon.im/deepseek.com?larger=true',
    website_url: 'https://deepseek.com',
    openrouter_id: 'deepseek',
    provider_type: 'open-weight',
    description: 'Pioneering open-weight reasoning and foundation models including DeepSeek-R1 and DeepSeek-V3.',
    headquarters: 'Hangzhou, China',
  },
  {
    slug: 'meta',
    name: 'Meta AI',
    logo_url: 'https://a.favicon.im/meta.com?larger=true',
    website_url: 'https://ai.meta.com',
    openrouter_id: 'meta-llama',
    provider_type: 'open-weight',
    description: 'Open source AI research lab building Llama 3.3, Segment Anything, and open-weight models.',
    headquarters: 'Menlo Park, CA, USA',
  },
  {
    slug: 'mistral',
    name: 'Mistral AI',
    logo_url: 'https://a.favicon.im/mistral.ai?larger=true',
    website_url: 'https://mistral.ai',
    openrouter_id: 'mistralai',
    provider_type: 'open-weight',
    description: 'European AI company crafting high-efficiency open and commercial models like Pixtral and Codestral.',
    headquarters: 'Paris, France',
  },
  {
    slug: 'nvidia',
    name: 'NVIDIA',
    logo_url: 'https://a.favicon.im/nvidia.com?larger=true',
    website_url: 'https://nvidia.com/ai',
    openrouter_id: 'nvidia',
    provider_type: 'infrastructure',
    description: 'Global compute leader providing GPU microservices, NIM inference engines, and Llama-3-Nemotron.',
    headquarters: 'Santa Clara, CA, USA',
  },
  {
    slug: 'xai',
    name: 'xAI',
    logo_url: 'https://a.favicon.im/x.ai?larger=true',
    website_url: 'https://x.ai',
    openrouter_id: 'x-ai',
    provider_type: 'frontier',
    description: 'Artificial intelligence company building Grok-2 and Grok-3 models with real-time knowledge.',
    headquarters: 'Burlingame, CA, USA',
  },
  {
    slug: 'cohere',
    name: 'Cohere',
    logo_url: 'https://a.favicon.im/cohere.com?larger=true',
    website_url: 'https://cohere.com',
    openrouter_id: 'cohere',
    provider_type: 'frontier',
    description: 'Enterprise AI platform specializing in retrieval-augmented generation (RAG) and Command R+ models.',
    headquarters: 'Toronto, Canada',
  },
  {
    slug: 'stability-ai',
    name: 'Stability AI',
    logo_url: 'https://a.favicon.im/stability.ai?larger=true',
    website_url: 'https://stability.ai',
    openrouter_id: 'stabilityai',
    provider_type: 'specialized',
    description: 'Open-media AI company behind Stable Diffusion 3.5, Stable Video, and Stable Audio.',
    headquarters: 'London, UK',
  },
  {
    slug: 'elevenlabs',
    name: 'ElevenLabs',
    logo_url: 'https://a.favicon.im/elevenlabs.io?larger=true',
    website_url: 'https://elevenlabs.io',
    openrouter_id: 'elevenlabs',
    provider_type: 'specialized',
    description: 'Audio AI research lab creating human-like voice synthesis, dubbing, and conversational voice agents.',
    headquarters: 'New York, NY, USA',
  },
  {
    slug: 'moonshot-kimi',
    name: 'Moonshot AI (Kimi)',
    logo_url: 'https://a.favicon.im/moonshot.cn?larger=true',
    website_url: 'https://moonshot.cn',
    openrouter_id: 'moonshot',
    provider_type: 'frontier',
    description: 'AI research lab developing ultra-long context reasoning models including Kimi k1.5.',
    headquarters: 'Beijing, China',
  },
  {
    slug: 'black-forest-labs',
    name: 'Black Forest Labs',
    logo_url: 'https://a.favicon.im/blackforestlabs.ai?larger=true',
    website_url: 'https://blackforestlabs.ai',
    openrouter_id: 'black-forest-labs',
    provider_type: 'specialized',
    description: 'Generative image research lab creating the state-of-the-art FLUX.1 model suite.',
    headquarters: 'Freiburg, Germany',
  },
];

export async function getAllProviders(): Promise<Provider[]> {
  try {
    const { data, error } = await supabase.from('providers').select('*');
    if (!error && data && data.length > 0) {
      return data as Provider[];
    }
  } catch {
    // Fallback if table does not exist
  }
  return FALLBACK_PROVIDERS;
}

export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  const providers = await getAllProviders();
  return providers.find((p) => p.slug === slug);
}

const PROVIDER_TOOL_KEYWORDS: Record<string, string[]> = {
  openai: ['chatgpt', 'openai', 'gpt', 'dall-e', 'sora', 'whisper'],
  anthropic: ['claude', 'anthropic', 'artifact'],
  google: ['gemini', 'google', 'imagen', 'notebooklm', 'deepmind'],
  deepseek: ['deepseek', 'r1'],
  meta: ['llama', 'meta'],
  mistral: ['mistral', 'codestral', 'pixtral'],
  nvidia: ['nvidia', 'nim'],
  xai: ['xai', 'grok'],
  cohere: ['cohere', 'command r'],
  'stability-ai': ['stable diffusion', 'stability', 'dreamstudio'],
  elevenlabs: ['elevenlabs'],
  'moonshot-kimi': ['moonshot', 'kimi'],
  'black-forest-labs': ['flux', 'black forest'],
};

export async function getToolsByProviderSlug(providerSlug: string): Promise<Tool[]> {
  const allTools = await getAllTools();
  const keywords = PROVIDER_TOOL_KEYWORDS[providerSlug] || [providerSlug];

  return allTools.filter((t) => {
    // 1. Direct provider_slug match
    if ((t as any).provider_slug === providerSlug) return true;

    // 2. Keyword match on name, description, features, or primary category
    const nameLower = t.tool_name.toLowerCase();
    const descLower = (t.description || '').toLowerCase();
    const slugLower = t.slug.toLowerCase();

    return keywords.some(
      (kw) => nameLower.includes(kw) || descLower.includes(kw) || slugLower.includes(kw)
    );
  });
}
