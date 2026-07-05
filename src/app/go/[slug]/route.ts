import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';
import { getToolBySlug } from '@/lib/tools';
import { appendFileSync } from 'fs';
import { join } from 'path';

// Affiliate link map — populate as you join affiliate programs
const AFFILIATE_LINKS: Record<string, string> = {
  // Example:
  // 'jasper-ai': 'https://jasper.ai/?via=YOUR_ID',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    redirect('/tools');
  }

  // Log the click (server-side, only works in Node.js runtime)
  try {
    const logEntry = JSON.stringify({
      ts: new Date().toISOString(),
      slug,
      tool: tool.tool_name,
      ref: request.headers.get('referer') || '',
      ua: request.headers.get('user-agent')?.slice(0, 100) || '',
    }) + '\n';

    const logPath = join(process.cwd(), 'public', 'data', 'clicks.jsonl');
    appendFileSync(logPath, logEntry);
  } catch {
    // Non-blocking — don't fail the redirect if logging fails
  }

  // Use affiliate link if available, otherwise use the tool's plain URL
  const destination = AFFILIATE_LINKS[slug] || tool.url;
  redirect(destination);
}
