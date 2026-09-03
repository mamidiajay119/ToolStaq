import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Understand the terms, guidelines, and user agreement for using the toolstaq AI directory.',
};

export default function TermsPage() {
  return (
    <>
      <style>{`
        /* ── Hero Card Banner Standard ── */
        .terms-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .terms-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .terms-hero-card { padding: 2.25rem 1.5rem; }
        }

        .terms-pill-badge {
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
        [data-theme='dark'] .terms-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .terms-monochrome-icon {
          width: 76px;
          height: 76px;
          border-radius: 22px;
          background: #ffffff;
          border: 1px solid rgba(0, 0, 0, 0.09);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #3f3f46;
          flex-shrink: 0;
        }
        [data-theme='dark'] .terms-monochrome-icon {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
          color: #ededed;
        }

        .terms-hero-heading {
          font-size: 2.2rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 0.75rem 0;
        }
        @media (min-width: 640px) {
          .terms-hero-heading { font-size: 2.65rem; }
        }

        .terms-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
          max-width: 620px;
        }

        /* ── Content Area ── */
        .policy-container {
          width: 100%;
          padding: 2.5rem 3rem 5rem 3rem;
          color: var(--text-primary);
          line-height: 1.8;
          font-size: 0.95rem;
        }
        @media (max-width: 640px) {
          .policy-container {
            padding: 2.5rem 1.5rem 5rem 1.5rem;
          }
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
        <div className="terms-hero-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div className="terms-pill-badge">
                <span>+ Legal Terms</span>
              </div>

              <h1 className="terms-hero-heading">
                Terms of Service
              </h1>

              <p className="terms-hero-sub">
                Please read these guidelines and user agreements carefully before exploring or submitting software to the <span className="brand-text">toolstaq</span> AI directory index.
              </p>
            </div>

            {/* Right-aligned Monochrome Icon Badge */}
            <div className="terms-monochrome-icon">
              <FileText size={36} />
            </div>
          </div>
        </div>

        <div className="policy-container">
          <p>
            Welcome to <span className="brand-text">toolstaq</span> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website, services, and directory index (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
          </p>

          <h2>1. Description of Service</h2>
          <p>
            <span className="brand-text">toolstaq</span> is a curated directory database cataloging artificial intelligence (AI) tools, applications, libraries, and frameworks. We provide descriptions, price estimations, categorizations, and comparison tools to help users discover software.
          </p>
          <p>
            Please note that <span className="brand-text">toolstaq</span> does not own, run, sell, or manage any of the third-party software products listed in the directory. We act purely as an informational index.
          </p>

          <h2>2. Third-Party Websites &amp; Services</h2>
          <p>
            Our Service contains outgoing links to external websites, apps, and platforms operated by third parties. 
          </p>
          <ul>
            <li>We have no control over the content, terms of service, privacy policies, safety, or pricing models of third-party products.</li>
            <li>We do not warrant, endorse, or guarantee the accuracy, completeness, or safety of any external services.</li>
            <li>Any transaction, subscription, or registration you perform on an external website is strictly between you and that third-party provider. <span className="brand-text">toolstaq</span> assumes no liability whatsoever for any damage, loss, or transaction failure resulting from your use of external software.</li>
          </ul>

          <h2>3. User Submissions</h2>
          <p>
            Users may submit AI tools for inclusion in our directory. By submitting a tool, you represent that all information provided is accurate and does not violate any copyright, trademark, or third-party right. We reserve the right to edit, decline, or remove any submission at our sole discretion.
          </p>

          <h2>4. Intellectual Property</h2>
          <p>
            All branding, design assets, directory structures, code, and editorial text created by <span className="brand-text">toolstaq</span> are the property of <span className="brand-text">toolstaq</span>. Third-party brand names, logos, and trademarks displayed in our directory belong to their respective owners.
          </p>

          <h2>5. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis without warranties of any kind. We do not guarantee uninterrupted access, error-free operation, or absolute accuracy of listed tools.
          </p>

          <h2>6. Contact &amp; Questions</h2>
          <p>
            If you have any questions regarding these Terms of Service, please reach out via our <Link href="/contact" className="policy-link">Contact Page</Link>.
          </p>
        </div>
      </div>
    </>
  );
}
