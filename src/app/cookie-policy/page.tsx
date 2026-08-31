import type { Metadata } from 'next';
import { Eye, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cookie Policy — ToolStaq',
  description: 'Understand how ToolStaq uses cookies and local storage to keep your site preferences active.',
};

export default function CookiePolicyPage() {
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
          <Eye size={12} color="#FFFFFF" />
          <span>SITE TRACKERS</span>
        </div>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Cookie Policy</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
          Learn how we use cookies and browser storage to optimize your experience.
        </p>
      </div>

      <div className="policy-container">
        <span className="policy-date">Last Updated: August 13, 2026</span>

        <p>
          ToolStaq uses cookies, local browser storage, and similar tracking tokens to enhance your navigation experience, save theme configurations, and analyze anonymous site traffic. This Cookie Policy explains what these trackers are and how we deploy them.
        </p>

        <h2>1. What are Cookies?</h2>
        <p>
          Cookies are small text files downloaded to your computer or mobile device when you visit a website. They allow websites to recognise your device, remember preferences, and verify actions.
        </p>
        <p>
          We also use **browser local storage** (`localStorage`), which acts similarly to cookies but is stored directly inside your browser database and does not get transmitted with network requests.
        </p>

        <h2>2. How We Use Cookies &amp; Storage</h2>
        <p>
          We classify our trackers into two categories:
        </p>
        
        <h3>A. Necessary &amp; Functional Trackers</h3>
        <p>
          These are required for the website to operate correctly. For example, ToolStaq uses `localStorage` to save your active visual theme:
        </p>
        <ul>
          <li><strong>Theme Toggle Flag</strong>: Remembers whether you selected **Light mode** or **Dark mode** so that pages load instantly in the correct visual theme as you click between directory listings.</li>
          <li><strong>Upvote Protection Tokens</strong>: Stores a reference indicating you have upvoted a tool, ensuring the client UI does not allow duplicate upvoting during your browser session.</li>
        </ul>

        <h3>B. Analytical &amp; Performance Trackers</h3>
        <p>
          These collect anonymous, aggregate information about how visitors navigate the directory:
        </p>
        <ul>
          <li>Identifies which AI categories receive the most clicks.</li>
          <li>Measures news article reading times and search terms.</li>
          <li>All analytical data is completely anonymized. We do not link performance metrics to emails or personal identities.</li>
        </ul>

        <h2>3. Managing Cookie Settings</h2>
        <p>
          Most web browsers automatically accept cookies. However, you can manage or disable cookies completely by adjusting your browser preferences (usually found under &quot;Options,&quot; &quot;Settings,&quot; or &quot;Privacy&quot;). 
        </p>
        <p>
          Please note that disabling cookies or clearing local storage will reset your visual theme preference back to the default setting and clear saved tool upvote visual statuses in the UI.
        </p>

        <h2>4. Contact Us</h2>
        <p>
          If you have any questions regarding our use of cookies or local storage, please reach out to us on our Contact Page.
        </p>
      </div>
    </>
  );
}
