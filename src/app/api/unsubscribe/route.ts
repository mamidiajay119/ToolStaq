import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required' }, { status: 400 });
    }

    if (!resend) {
      console.log(`[Dev Simulation] Unsubscribe request received for: [REDACTED]`);
      return NextResponse.json({
        success: true,
        message: 'Unsubscribed successfully (Development Mode Simulation).',
      });
    }

    const audienceId = process.env.RESEND_AUDIENCE_ID;

    if (audienceId) {
      try {
        await resend.contacts.remove({
          email,
          audienceId,
        });
      } catch (err: any) {
        console.warn('Resend contact remove warning:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'You have been unsubscribed from toolstaq updates.',
    });
  } catch (error: any) {
    console.error('[Unsubscribe API] Error processing request:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
