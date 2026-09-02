import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy — toolstaq',
  description: 'Understand how toolstaq uses cookies and local storage to keep your site preferences active.',
};

export default function CookiePolicyPage() {
  return (
    <>
      <style>{`
        /* ── Hero Card Banner Standard ── */
        .cookie-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .cookie-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .cookie-hero-card { padding: 2.25rem 1.5rem; }
        }

        .cookie-pill-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 10px;
          border-radius: 99px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 1.5px 4px rgba(0, 0, 0, 0.03);
          font-size: 0.70rem;
          font-weight: 500;
          color: #18181b;
          margin-bottom: 0.85rem;
          letter-spacing: -0.01em;
        }
        [data-theme='dark'] .cookie-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .cookie-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 0.85rem 0;
        }
        @media (min-width: 640px) {
          .cookie-hero-heading { font-size: 2.85rem; }
        }

        .cookie-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
          max-width: 620px;
        }

        /* ── Content Area ── */
        .policy-container {
          width: 100%;
          padding: 2.5rem 0 5rem;
          color: var(--text-primary);
          line-height: 1.8;
          font-size: 0.95rem;
        }
        .policy-container h2 {
          font-size: 1.35rem;
          font-weight: 600;
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
        .policy-link {
          color: var(--accent-primary);
          text-decoration: none;
          font-weight: 500;
          transition: opacity 150ms ease;
        }
        .policy-link:hover {
          opacity: 0.8;
          text-decoration: none;
        }
      `}</style>

      {/* Hero Card Banner */}
      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '1rem' }}>
        <div className="cookie-hero-card">
          <div className="cookie-pill-badge">
            <span>+ Cookie policy</span>
          </div>

          <h1 className="cookie-hero-heading">
            Cookie Policy
          </h1>

          <p className="cookie-hero-sub">
            Learn how toolstaq uses cookies and local browser storage to save your theme preferences and optimize browsing performance.
          </p>
        </div>

        <div className="policy-container">
          <p>
            toolstaq uses cookies, local browser storage, and similar tracking tokens to enhance your navigation experience, save theme configurations, and analyze anonymous site traffic. This Cookie Policy explains what these trackers are and how we deploy them.
          </p>

          <h2>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your computer or mobile device when you visit a website. They allow the site to remember your actions and preferences (such as dark/light mode preference, filter states, and active session settings) over a period of time.
          </p>

          <h2>2. Cookies We Use</h2>
          <p>
            We restrict tracker usage to essential functionality:
          </p>
          <ul>
            <li><strong>Essential &amp; Preference Cookies:</strong> Used to save your active theme selection (Light vs Dark mode) and local filter choices across directory sessions.</li>
            <li><strong>Performance &amp; Analytics:</strong> Anonymous, privacy-friendly analytics cookies used to measure aggregate visitor counts and popular tool categories.</li>
          </ul>

          <h2>3. Managing Your Preferences</h2>
          <p>
            You can control or clear cookies at any time through your browser settings. Please note that disabling essential local storage may reset your light/dark theme preference to default.
          </p>

          <h2>4. Contact Us</h2>
          <p>
            If you have questions regarding our cookie practices, please contact us via our <Link href="/contact" className="policy-link">Contact Page</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
