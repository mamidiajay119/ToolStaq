import type { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — ToolStaq',
  description: 'Understand the terms, guidelines, and user agreement for using the ToolStaq AI directory.',
};

export default function TermsPage() {
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
          <Shield size={12} color="#FFFFFF" />
          <span>LEGAL AGREEMENT</span>
        </div>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Terms of Service</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
          Please read these terms carefully before using the ToolStaq AI directory.
        </p>
      </div>

      <div className="policy-container">
        <span className="policy-date">Last Updated: August 13, 2026</span>

        <p>
          Welcome to ToolStaq (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our website, services, and directory index (collectively, the &quot;Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
        </p>

        <h2>1. Description of Service</h2>
        <p>
          ToolStaq is a curated directory database cataloging artificial intelligence (AI) tools, applications, libraries, and frameworks. We provide descriptions, price estimations, categorizations, and comparison tools to help users discover software.
        </p>
        <p>
          Please note that ToolStaq does not own, run, sell, or manage any of the third-party software products listed in the directory. We act purely as an informational index.
        </p>

        <h2>2. Third-Party Websites &amp; Services</h2>
        <p>
          Our Service contains outgoing links to external websites, apps, and platforms operated by third parties. 
        </p>
        <ul>
          <li>We have no control over the content, terms of service, privacy policies, safety, or pricing models of third-party products.</li>
          <li>We do not warrant, endorse, or guarantee the accuracy, completeness, or safety of any external services.</li>
          <li>Any transaction, subscription, or registration you perform on an external website is strictly between you and that third-party provider. ToolStaq assumes no liability whatsoever for any damage, loss, or transaction failure resulting from your use of external software.</li>
        </ul>

        <h2>3. User Submissions</h2>
        <p>
          If you submit an AI tool for inclusion in our directory via the submission form:
        </p>
        <ul>
          <li>You warrant that all information provided (tool name, description, URL, tags) is accurate, truthful, and up-to-date.</li>
          <li>You grant ToolStaq a non-exclusive, worldwide, royalty-free, perpetual license to display your tool&apos;s name, logo, links, and description on our directory.</li>
          <li>We reserve the right to review, edit, reject, delete, or re-categorize any tool submission at our sole discretion, without notice.</li>
        </ul>

        <h2>4. Directory Content &amp; Accuracy</h2>
        <p>
          While we make reasonable efforts to verify categories, pricing labels, and descriptions, AI products evolve rapidly. ToolStaq does not guarantee that the directory database is 100% accurate, error-free, or up-to-date. Pricing, feature lists, and availability are subject to change by third-party creators at any time.
        </p>

        <h2>5. Intellectual Property</h2>
        <p>
          All branding, code, layouts, design tokens, graphics, and custom search indexes are the property of ToolStaq and are protected by international copyright laws. Third-party brand names, icons, logos, and descriptions remain the intellectual property of their respective creators and are displayed here strictly under fair-use guidelines for educational and review purposes.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p style={{ fontStyle: 'italic' }}>
          The service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. ToolStaq makes no warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, non-infringement, or availability.
        </p>

        <h2>7. Contact</h2>
        <p>
          For any questions regarding these Terms of Service or to request removal or editing of a listing, please contact us through our dedicated <Link href="/contact" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Contact Page</Link>.
        </p>
      </div>
    </>
  );
}
