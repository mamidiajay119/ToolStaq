import { NextRequest, NextResponse } from 'next/server';
import { incrementViewCount } from '@/lib/news';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json() as { slug?: string };
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'slug required' }, { status: 400 });
    }
    // Fire-and-forget — we don't await the result to keep the response fast
    incrementViewCount(slug).catch(console.error);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 });
  }
}
