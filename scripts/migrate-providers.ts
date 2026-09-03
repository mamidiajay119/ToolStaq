import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase URL or Key in .env.local');
  process.exit(1);
}

export interface ProviderSeed {
  slug: string;
  name: string;
  logo_url: string;
  website_url: string;
  openrouter_id: string;
  provider_type: 'frontier' | 'open-weight' | 'infrastructure' | 'specialized';
  description: string;
  headquarters: string;
}

export const INITIAL_PROVIDERS: ProviderSeed[] = [
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

async function supabaseRestCall(pathStr: string, options: RequestInit = {}) {
  const res = await fetch(`${supabaseUrl}/rest/v1/${pathStr}`, {
    ...options,
    headers: {
      'apikey': serviceRoleKey!,
      'Authorization': `Bearer ${serviceRoleKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
      ...(options.headers || {}),
    },
  });
  return res;
}

async function migrate() {
  console.log('🚀 Starting Model Providers REST Migration...');

  // 1. Upsert providers into Supabase via REST API
  console.log('📦 Seeding providers table...');
  const res = await supabaseRestCall('providers', {
    method: 'POST',
    body: JSON.stringify(INITIAL_PROVIDERS),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.warn('⚠️ REST upsert to providers table response:', res.status, errText);
  } else {
    console.log(`✅ Successfully seeded ${INITIAL_PROVIDERS.length} providers via Supabase REST API!`);
  }

  // 2. Map existing tools to provider_slug
  console.log('🔗 Mapping tools to provider_slug...');
  const mappings: { provider_slug: string; slugs: string[] }[] = [
    { provider_slug: 'openai', slugs: ['chatgpt', 'openai-api', 'sora-openai', 'dall-e-3', 'whisper-openai'] },
    { provider_slug: 'anthropic', slugs: ['claude-ai-anthropic', 'claude-3-5-sonnet', 'claude-3-opus', 'claude-artifact'] },
    { provider_slug: 'google', slugs: ['gemini-google', 'google-ai-studio', 'imagen-3', 'notebooklm-google'] },
    { provider_slug: 'deepseek', slugs: ['deepseek', 'deepseek-r1', 'deepseek-coder'] },
    { provider_slug: 'meta', slugs: ['llama-3-3-meta', 'meta-ai'] },
    { provider_slug: 'mistral', slugs: ['mistral-ai', 'le-chat-mistral', 'codestral-mistral'] },
    { provider_slug: 'stability-ai', slugs: ['stable-diffusion-3-5', 'dreamstudio-stability'] },
    { provider_slug: 'elevenlabs', slugs: ['elevenlabs', 'elevenlabs-reader'] },
    { provider_slug: 'black-forest-labs', slugs: ['flux-1-black-forest-labs'] },
  ];

  for (const m of mappings) {
    const patchRes = await supabaseRestCall(`tools?slug=in.(${m.slugs.join(',')})`, {
      method: 'PATCH',
      body: JSON.stringify({ provider_slug: m.provider_slug }),
    });

    if (patchRes.ok) {
      console.log(`  ✓ Linked tools to ${m.provider_slug}`);
    } else {
      console.warn(`  ⚠️ Error linking tools for ${m.provider_slug}:`, patchRes.status);
    }
  }

  console.log('🎉 Migration completed successfully!');
}

migrate().catch(console.error);
