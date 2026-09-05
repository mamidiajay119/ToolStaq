import type { NewsArticle } from '@/app/news/page';

interface WeeklyDigestParams {
  articles: NewsArticle[];
  unsubscribeUrl?: string;
}

interface WelcomeEmailParams {
  email: string;
  recentArticles: NewsArticle[];
  unsubscribeUrl?: string;
}

const DEFAULT_UNSUBSCRIBE_URL = 'https://toolstaq.com/unsubscribe';

/**
 * Escapes HTML entities for safe inclusion in email templates
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generates the Light Mode Branded Weekly AI Digest HTML Email Template
 */
export function renderWeeklyDigestHtml({ articles, unsubscribeUrl = DEFAULT_UNSUBSCRIBE_URL }: WeeklyDigestParams): string {
  const newsList = articles.slice(0, 5);

  const articlesHtml = newsList.map((article) => {
    const title = escapeHtml(article.title);
    const excerpt = escapeHtml(article.excerpt);
    const category = escapeHtml(article.category);
    const source = escapeHtml(article.source || 'AI Intel');
    const date = escapeHtml(article.date || 'Recently');
    const url = article.url || `https://toolstaq.com/news/${article.slug}`;

    return `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
        <div style="display: inline-block; padding: 3px 10px; border-radius: 99px; background-color: #f3f4f6; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600; color: #374151; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.04em;">
          + ${category}
        </div>
        <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 700; color: #111827; line-height: 1.35; letter-spacing: -0.01em;">
          <a href="${url}" target="_blank" style="color: #111827; text-decoration: none;">${title}</a>
        </h3>
        <p style="margin: 0 0 14px 0; font-size: 13px; color: #4b5563; line-height: 1.55;">
          ${excerpt}
        </p>
        <div style="display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #9ca3af; border-top: 1px solid #f3f4f6; padding-top: 12px;">
          <span>${source} &bull; ${date}</span>
          <a href="${url}" target="_blank" style="display: inline-block; padding: 6px 14px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 8px; font-size: 12px; font-weight: 600;">
            Read Story &rarr;
          </a>
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>toolstaq Weekly AI Intel</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
          
          <!-- Top Header -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #f3f4f6; background-color: #ffffff; text-align: center;">
              <a href="https://toolstaq.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 10px;">
                      <img src="https://toolstaq.com/logo.png" alt="toolstaq" width="34" height="34" style="display: block; border-radius: 8px; width: 34px; height: 34px;" />
                    </td>
                    <td style="vertical-align: middle;">
                      <span style="font-size: 26px; font-weight: 800; color: #8b5cf6; letter-spacing: -0.03em;">toolstaq</span>
                    </td>
                  </tr>
                </table>
              </a>
              <div style="font-size: 13px; font-weight: 500; color: #6b7280; margin-top: 6px; letter-spacing: -0.01em;">
                AI News, Simplified &bull; Weekly Intel Digest
              </div>
            </td>
          </tr>

          <!-- Banner Intro -->
          <tr>
            <td style="padding: 28px 32px 20px 32px; background: linear-gradient(180deg, #f8f5ff 0%, #ffffff 100%);">
              <div style="display: inline-block; padding: 4px 12px; border-radius: 99px; background-color: #ffffff; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600; color: #8b5cf6; margin-bottom: 12px;">
                + Top 5 Weekly AI Headlines
              </div>
              <h1 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">
                The Signal in AI This Week
              </h1>
              <p style="margin: 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                Here are the top 5 curated AI breakthroughs, model releases, and engineering trends verified by the <strong>toolstaq</strong> editorial team.
              </p>
            </td>
          </tr>

          <!-- News Articles List -->
          <tr>
            <td style="padding: 12px 24px 24px 24px;">
              ${articlesHtml}
            </td>
          </tr>

          <!-- Action Banner -->
          <tr>
            <td style="padding: 24px 32px; background-color: #fafafa; border-top: 1px solid #f3f4f6; text-align: center;">
              <h4 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #111827;">
                Looking for new AI tools?
              </h4>
              <p style="margin: 0 0 16px 0; font-size: 13px; color: #6b7280;">
                Discover over 2,700+ verified AI software tools and agents in our directory.
              </p>
              <a href="https://toolstaq.com/tools" target="_blank" style="display: inline-block; padding: 9px 20px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 600;">
                Explore Directory &rarr;
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #ffffff; border-top: 1px solid #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af; line-height: 1.5;">
              <p style="margin: 0 0 8px 0;">
                You are receiving this email because you subscribed to updates on <a href="https://toolstaq.com" target="_blank" style="color: #8b5cf6; text-decoration: none;">toolstaq.com</a>.
              </p>
              <p style="margin: 0;">
                <a href="${unsubscribeUrl}" target="_blank" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> &bull;
                <a href="https://toolstaq.com/privacy" target="_blank" style="color: #6b7280; text-decoration: none;">Privacy Policy</a> &bull;
                <a href="https://toolstaq.com/contact" target="_blank" style="color: #6b7280; text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generates the Instant Light Mode Branded Welcome Email HTML Template
 */
export function renderWelcomeEmailHtml({ email, recentArticles, unsubscribeUrl = DEFAULT_UNSUBSCRIBE_URL }: WelcomeEmailParams): string {
  const topNewsPreview = recentArticles.slice(0, 3).map((article) => {
    const title = escapeHtml(article.title);
    const category = escapeHtml(article.category);
    const source = escapeHtml(article.source || 'AI Source');
    const url = article.url || `https://toolstaq.com/news/${article.slug}`;

    return `
      <div style="background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 14px 16px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.02);">
        <div style="display: inline-block; padding: 2px 8px; border-radius: 99px; background-color: #f3f4f6; border: 1px solid #e5e7eb; font-size: 10px; font-weight: 700; color: #374151; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.04em;">
          + ${category}
        </div>
        <div style="font-size: 14px; font-weight: 700; color: #111827; line-height: 1.35;">
          <a href="${url}" target="_blank" style="color: #111827; text-decoration: none;">${title} &rarr;</a>
        </div>
        <div style="font-size: 11px; color: #9ca3af; margin-top: 6px;">
          Source: ${source}
        </div>
      </div>
    `;
  }).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to toolstaq!</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #111827;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #e5e7eb; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.04);">
          
          <!-- Top Header -->
          <tr>
            <td style="padding: 28px 32px; border-bottom: 1px solid #f3f4f6; background-color: #ffffff; text-align: center;">
              <a href="https://toolstaq.com" target="_blank" style="text-decoration: none; display: inline-block;">
                <table border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 10px;">
                      <img src="https://toolstaq.com/logo.png" alt="toolstaq" width="34" height="34" style="display: block; border-radius: 8px; width: 34px; height: 34px;" />
                    </td>
                    <td style="vertical-align: middle;">
                      <span style="font-size: 26px; font-weight: 800; color: #8b5cf6; letter-spacing: -0.03em;">toolstaq</span>
                    </td>
                  </tr>
                </table>
              </a>
              <div style="font-size: 13px; font-weight: 500; color: #6b7280; margin-top: 6px; letter-spacing: -0.01em;">
                AI News, Simplified &bull; Welcome Briefing
              </div>
            </td>
          </tr>

          <!-- Welcome Banner Section -->
          <tr>
            <td style="padding: 32px; background: linear-gradient(180deg, #f8f5ff 0%, #ffffff 100%);">
              <div style="display: inline-block; padding: 4px 12px; border-radius: 99px; background-color: #ffffff; border: 1px solid #e5e7eb; font-size: 11px; font-weight: 600; color: #8b5cf6; margin-bottom: 12px;">
                + Welcome to toolstaq
              </div>
              <h1 style="margin: 0 0 12px 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.02em;">
                You're in! Welcome aboard 🎉
              </h1>
              <p style="margin: 0 0 16px 0; font-size: 14px; color: #4b5563; line-height: 1.6;">
                Thank you for subscribing to <strong>toolstaq</strong>. Every Monday morning, we deliver a 2-minute high-signal digest of the top 5 AI news breakthroughs, model releases, and developer tools.
              </p>
              <p style="margin: 0 0 20px 0; font-size: 14px; font-weight: 600; color: #111827;">
                Here is a quick snapshot of what is currently trending:
              </p>

              <!-- Recent News Snapshot -->
              ${topNewsPreview}

              <!-- Primary Call To Action Button -->
              <div style="text-align: center; margin-top: 24px;">
                <a href="https://toolstaq.com/tools" target="_blank" style="display: inline-block; padding: 8px 18px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 10px; font-size: 13px; font-weight: 600;">
                  Explore 2,700+ AI Tools &rarr;
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #ffffff; border-top: 1px solid #f3f4f6; text-align: center; font-size: 12px; color: #9ca3af; line-height: 1.5;">
              <p style="margin: 0 0 6px 0;">Subscribed address: <strong>${escapeHtml(email)}</strong></p>
              <p style="margin: 0;">
                <a href="${unsubscribeUrl}" target="_blank" style="color: #6b7280; text-decoration: underline;">Unsubscribe</a> &bull;
                <a href="https://toolstaq.com/privacy" target="_blank" style="color: #6b7280; text-decoration: none;">Privacy Policy</a> &bull;
                <a href="https://toolstaq.com/contact" target="_blank" style="color: #6b7280; text-decoration: none;">Contact Support</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
