import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { getTopAINewsForNewsletter } from '@/lib/newsletter/aggregator';
import { renderWeeklyDigestHtml, renderWelcomeEmailHtml } from '@/lib/newsletter/template';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function GET(req: NextRequest) {
  try {
    // 1. Verify Secret Authorization to prevent unauthorized invocations
    const authHeader = req.headers.get('authorization');
    const secretParam = req.nextUrl.searchParams.get('secret');
    const expectedSecret = process.env.CRON_SECRET;

    if (process.env.NODE_ENV === 'production' && !expectedSecret) {
      return NextResponse.json({ error: 'CRON_SECRET environment variable is missing' }, { status: 401 });
    }

    if (expectedSecret) {
      const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
      const isParamValid = secretParam === expectedSecret;
      if (!isHeaderValid && !isParamValid) {
        return NextResponse.json({ error: 'Unauthorized invocation' }, { status: 401 });
      }
    }

    const emailType = req.nextUrl.searchParams.get('type') || 'digest';

    // 2. Fetch Top 5 AI News Headlines of the week
    const topArticles = await getTopAINewsForNewsletter(5);
    if (!topArticles || topArticles.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No news articles available for newsletter digest.',
      });
    }

    // 3. Check Resend configuration
    if (!resend) {
      console.log('[Dev Simulation] Newsletter Cron Executed with Top 5 Articles:', topArticles.map(a => a.title));
      return NextResponse.json({
        success: true,
        simulation: true,
        message: 'Newsletter Cron executed in simulation mode (No RESEND_API_KEY).',
        articlesCount: topArticles.length,
        articles: topArticles.map(a => ({ title: a.title, category: a.category })),
      });
    }

    // 4. Fetch Contacts / Audience list from Resend or test_email query param
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    const testEmail = req.nextUrl.searchParams.get('test_email') || req.nextUrl.searchParams.get('email');
    let contactsList: { email: string; unsubscribed?: boolean }[] = [];

    if (testEmail) {
      contactsList = [{ email: testEmail }];
    } else if (audienceId) {
      try {
        const response = await resend.contacts.list({ audienceId });
        if (response.data?.data) {
          contactsList = response.data.data.filter((c: any) => !c.unsubscribed);
        }
      } catch (err: any) {
        console.warn('Could not fetch audience contacts list:', err);
      }
    }

    // Fallback check if list is empty and no test_email passed
    if (contactsList.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Newsletter compiled successfully (Top 5 AI News ready), but no active contacts were found. Pass ?test_email=your@email.com or configure RESEND_AUDIENCE_ID in .env.local to send to real subscribers.',
        articlesCount: topArticles.length,
        articles: topArticles.map(a => ({ title: a.title, category: a.category })),
      });
    }

    // 5. Broadcast Email to Subscribers (Digest or Welcome Template)
    let sentCount = 0;
    const errors: string[] = [];

    for (const contact of contactsList) {
      try {
        const unsubscribeUrl = `https://toolstaq.com/unsubscribe?email=${encodeURIComponent(contact.email)}`;
        const html = emailType === 'welcome'
          ? renderWelcomeEmailHtml({ email: contact.email, recentArticles: topArticles, unsubscribeUrl })
          : renderWeeklyDigestHtml({ articles: topArticles, unsubscribeUrl });

        const subject = emailType === 'welcome'
          ? 'Welcome to toolstaq — AI News, Simplified 🎉'
          : 'toolstaq Intel: Top 5 AI News Headlines This Week ⚡';

        const fromEmail = process.env.RESEND_FROM_EMAIL || 'toolstaq Newsletter <newsletter@toolstaq.com>';

        const response = await resend.emails.send({
          from: fromEmail,
          to: contact.email,
          subject,
          html,
          headers: {
            'List-Unsubscribe': `<${unsubscribeUrl}>`,
          },
        });

        if (response.error) {
          // If custom domain is not verified, try Resend dev testing sender
          if (response.error.message?.toLowerCase().includes('domain') || response.error.message?.toLowerCase().includes('testing')) {
            const fallbackResponse = await resend.emails.send({
              from: 'onboarding@resend.dev',
              to: contact.email,
              subject,
              html,
              headers: {
                'List-Unsubscribe': `<${unsubscribeUrl}>`,
              },
            });

            if (fallbackResponse.error) {
              errors.push(`Failed to send to ${contact.email}: ${fallbackResponse.error.message}`);
            } else {
              sentCount++;
            }
          } else {
            errors.push(`Failed to send to ${contact.email}: ${response.error.message}`);
          }
        } else {
          sentCount++;
        }
      } catch (err: any) {
        errors.push(`Failed to send to ${contact.email}: ${err.message || err}`);
      }
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      articlesSentCount: topArticles.length,
      subscribersTargetedCount: contactsList.length,
      sentCount,
      errors,
    });
  } catch (error: any) {
    console.error('[Newsletter Cron Handler] Unexpected error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error during newsletter cron' },
      { status: 500 }
    );
  }
}
