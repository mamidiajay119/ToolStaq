import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy — toolstaq',
  description: 'Learn how toolstaq protects, manages, and respects your personal data and privacy settings.',
};

export default function PrivacyPage() {
  return (
    <>
      <style>{`
        /* ── Hero Card Banner Standard ── */
        .privacy-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .privacy-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .privacy-hero-card { padding: 2.25rem 1.5rem; }
        }

        .privacy-pill-badge {
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
        [data-theme='dark'] .privacy-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .privacy-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 0.85rem 0;
        }
        @media (min-width: 640px) {
          .privacy-hero-heading { font-size: 2.85rem; }
        }

        .privacy-hero-sub {
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
        <div className="privacy-hero-card">
          <div className="privacy-pill-badge">
            <span>+ Privacy policy</span>
          </div>

          <h1 className="privacy-hero-heading">
            Privacy Policy
          </h1>

          <p className="privacy-hero-sub">
            Your privacy is fundamental to us. Learn how toolstaq protects, manages, and respects your personal data.
          </p>
        </div>

        <div className="policy-container">
          <p>
            At toolstaq (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), we are committed to protecting your privacy. This Privacy Policy details the types of information we collect, how we use it, and the security measures we take to protect your data when you visit and interact with our AI directory.
          </p>

          <h2>1. Information We Collect</h2>
          <p>
            We minimize data collection to provide a fast, secure, and privacy-respecting directory browsing experience:
          </p>
          <ul>
            <li><strong>Usage &amp; Analytics Data:</strong> Anonymous page views, referrer links, device browser types, and interaction counts to improve directory navigation.</li>
            <li><strong>Submitted Form Data:</strong> Information explicitly provided when submitting an AI tool or contacting support (such as Tool Name, URL, Description, and Contact Email).</li>
            <li><strong>Cookie &amp; Theme Tokens:</strong> Client-side browser storage entries to remember your light/dark theme preference and active filter options.</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <p>
            We process information solely to provide and improve the toolstaq platform:
          </p>
          <ul>
            <li>To index, review, and publish user-submitted AI tools to the directory.</li>
            <li>To respond to user support inquiries and feedback.</li>
            <li>To maintain system performance, prevent spam, and secure our network infrastructure.</li>
          </ul>

          <h2>3. Data Sharing &amp; Third Parties</h2>
          <p>
            We do not sell, rent, or trade your personal data to third parties. We may share anonymous aggregated usage statistics or utilize secure hosting and infrastructure providers (such as Vercel and Cloudflare) strictly to operate the Service.
          </p>

          <h2>4. Data Retention &amp; Rights</h2>
          <p>
            You may request deletion of any contact email or tool submission record by reaching out to our team at any time.
          </p>

          <h2>5. Contact Us</h2>
          <p>
            If you have any questions or privacy concerns, please contact us via our <Link href="/contact" className="policy-link">Contact Page</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
