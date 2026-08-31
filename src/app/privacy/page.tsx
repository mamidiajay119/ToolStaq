import type { Metadata } from 'next';
import Link from 'next/link';
import { Lock, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — toolstaq',
  description: 'Learn how toolstaq protects, manages, and respects your personal data and privacy settings.',
};

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        .policy-container {
          max-width: 780px;
          margin: 0 auto;
          padding: 4rem 1.5rem;
          color: var(--text-primary);
          line-height: 1.8;
          font-size: 0.95rem;
        }
        .policy-container h2 {
          font-size: 1.35rem;
          fontWeight: 600;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
          border-bottom: var(--border-width, 1px) solid var(--border-subtle);
          padding-bottom: 8px;
        }
        .policy-container p {
          margin-bottom: 1.25rem;
          color: var(--text-secondary);
        }
        .policy-container ul {
          margin-bottom: 1.5rem;
          padding-left: 1.25rem;
          color: var(--text-secondary);
        }
        .policy-container li {
          margin-bottom: 0.5rem;
        }
        .policy-date {
          font-size: 0.825rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          display: block;
        }
      `}</style>

      {/* Hero */}
      <div className="inner-hero" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px',
          borderRadius: '99px',
          background: 'rgba(255, 255, 255, 0.15)',
          border: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.25)',
          fontSize: '0.75rem',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '1.25rem',
        }}>
          <Lock size={12} color="#FFFFFF" />
          <span>DATA SECURITY</span>
        </div>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Privacy Policy</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
          Your privacy is important to us. Learn how we handle your personal data.
        </p>
      </div>

      <div className="policy-container">
        <span className="policy-date">Last Updated: August 13, 2026</span>

        <p>
          At toolstaq (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy. This Privacy Policy details the types of information we collect, how we use it, and the security measures we take to protect your data when you visit and interact with our AI directory.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We collect minimal personal data. The only data collected from you includes:
        </p>
        <ul>
          <li><strong>Email Addresses</strong>: If you voluntarily subscribe to our newsletter briefing or fill out the newsletter form, we collect your email address.</li>
          <li><strong>Browser Fingerprint Flags</strong>: To prevent spam upvoting on tools, our upvote system creates an anonymous browser fingerprint flag. This is stored securely in our database and cannot be used to identify your real-world identity or track you across other websites.</li>
          <li><strong>Usage Data</strong>: We collect anonymous analytical cookies (like page view counts, click events, and landing paths) to measure performance.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          Any information we collect is strictly used for the following purposes:
        </p>
        <ul>
          <li>To distribute the weekly AI News and tool updates (only for newsletter subscribers).</li>
          <li>To prevent fraudulent activity and spam (such as double-voting on listed tools).</li>
          <li>To analyze traffic patterns and optimize page load speeds, layouts, and search query flows.</li>
        </ul>

        <h2>3. Data Sharing &amp; Disclosures</h2>
        <p>
          We do not sell, trade, rent, or lease your email address or usage data to third-party marketing companies. 
        </p>
        <p>
          We may share anonymous data with trusted service providers who help us host our database (such as Supabase, Vercel, or database servers) or manage email delivery (such as Resend or other email dispatch APIs). These providers are legally bound to protect your data and only use it to execute services for toolstaq.
        </p>

        <h2>4. Cookies &amp; Theme Storage</h2>
        <p>
          toolstaq uses standard browser features (such as `localStorage` and basic cookies) to store your preferred site configuration, specifically your theme preference (keeping Light mode or Dark mode active as you navigate between pages). For detailed information, please review our dedicated <Link href="/cookie-policy" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Cookie Policy</Link>.
        </p>

        <h2>5. Your Rights (GDPR &amp; CCPA Compliance)</h2>
        <p>
          Depending on your location, you have rights regarding your personal data:
        </p>
        <ul>
          <li><strong>Unsubscribe</strong>: You can unsubscribe from our newsletters at any time by clicking the &quot;Unsubscribe&quot; link in the footer of any email we send you.</li>
          <li><strong>Deletion</strong>: You can request that we delete your email address from our records completely. To do so, please drop us a line on our <Link href="/contact" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Contact Page</Link>.</li>
        </ul>

        <h2>6. Changes to this Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When updates are published, the &quot;Last Updated&quot; date at the top of the page will be revised. We recommend reviewing this page periodically.
        </p>
      </div>
    </>
  );
}
