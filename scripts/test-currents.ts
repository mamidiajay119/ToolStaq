import * as fs from 'fs';
import * as path from 'path';

// 1. Manually load environment variables from .env.local
try {
  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          process.env[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
  }
} catch (e) {
  console.error("Failed to load .env.local file:", e);
}

const currentsKey = process.env.CURRENTS_API_KEY;

if (!currentsKey || currentsKey.includes("YOUR_CURRENTS_API_KEY_HERE")) {
  console.error("❌ CURRENTS_API_KEY is not configured in .env.local!");
  process.exit(1);
}

// Guarantee type to TypeScript compiler
const activeKey: string = currentsKey;

async function testConnection() {
  console.log("🔄 Testing connection to Currents API...");
  console.log(`Using API Key: ${activeKey.slice(0, 5)}...${activeKey.slice(-5)}`);

  try {
    const searchQuery = encodeURIComponent('"artificial intelligence" OR "generative AI" OR "large language model" OR "AI tools" OR "LLM" OR "OpenAI" OR "Anthropic"');
    const response = await fetch(
      `https://api.currentsapi.services/v1/search?query=${searchQuery}&category=technology&language=en&limit=3`,
      {
        method: "GET",
        headers: {
          "Authorization": activeKey,
        },
      }
    );

    if (!response.ok) {
      console.error(`❌ HTTP Error! Status: ${response.status}`);
      const text = await response.text();
      console.error(`Response body: ${text}`);
      return;
    }

    const data = await response.json();
    const articles = data.news || [];

    console.log("✅ Success! Connection established.");
    console.log(`Received ${articles.length} test articles.\n`);
    
    articles.forEach((art: any, index: number) => {
      console.log(`[${index + 1}] ${art.title}`);
      console.log(`    Source: ${art.url ? new URL(art.url).hostname : 'Unknown'}`);
      console.log(`    Published: ${art.published}`);
      console.log("-".repeat(50));
    });
  } catch (error) {
    console.error("❌ Network or request error:", error);
  }
}

testConnection();
