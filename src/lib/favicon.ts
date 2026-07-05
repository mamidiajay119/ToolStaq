/**
 * favicon.ts — Utility to derive favicon/logo src URLs from a tool's homepage URL.
 *
 * Priority:
 *   1. Pre-scraped favicon_url stored in tools.json (passed directly to ToolLogo)
 *   2. Google Favicon Service (sz=128 for sharp rendering on retina displays)
 */

/**
 * Returns a Google Favicon Service URL for the given tool homepage URL.
 * Used as the fallback when no scraped favicon_url is available.
 *
 * @example
 *   urlToFaviconSrc('https://adorno.ai/')
 *   // → 'https://www.google.com/s2/favicons?sz=128&domain=adorno.ai'
 */
export function urlToFaviconSrc(toolUrl: string): string {
  if (!toolUrl) return '';
  try {
    const { hostname } = new URL(toolUrl);
    const domain = hostname.replace(/^www\./, '');
    if (!domain) return '';
    return `https://www.google.com/s2/favicons?sz=128&domain=${domain}`;
  } catch {
    return '';
  }
}
