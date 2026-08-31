import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');
  if (!url) {
    return new NextResponse('Missing url param', { status: 400 });
  }

  // Basic safety check — only allow http/https URLs
  let parsed: URL;
  try {
    parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return new NextResponse('Invalid URL protocol', { status: 400 });
    }
  } catch {
    return new NextResponse('Invalid URL', { status: 400 });
  }

  try {
    const response = await fetch(parsed.toString(), {
      headers: {
        // Appear as a normal browser request to bypass hotlink protection
        'User-Agent': 'Mozilla/5.0 (compatible; ToolStaq/1.0; +https://toolstaq.com)',
        'Accept': 'image/webp,image/avif,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        // No Referer — avoids same-site hotlink checks
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return new NextResponse('Upstream image error', { status: 502 });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 400 });
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (e) {
    console.error('[image-proxy] fetch failed:', e);
    return new NextResponse('Failed to fetch image', { status: 500 });
  }
}
