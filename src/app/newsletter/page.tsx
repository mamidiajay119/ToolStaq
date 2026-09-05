import type { Metadata } from 'next';
import { ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import NewsletterForm from '@/components/news/NewsletterForm';

export const metadata: Metadata = {
  title: 'Subscribe to the toolstaq Newsletter — Stay Ahead on AI',
  description: 'Get weekly breakdowns of top AI tools, new model releases, and practical workflow recipes delivered straight to your inbox.',
};

export default function NewsletterPage() {
  return (
    <>
      <style>{`
        .newsletter-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .newsletter-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .newsletter-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .newsletter-hero-grid { grid-template-columns: 1.1fr 0.9fr; }
        }

        .newsletter-pill-badge {
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
        [data-theme='dark'] .newsletter-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .newsletter-hero-heading {
          font-size: clamp(2rem, 4vw, 2.6rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .newsletter-hero-sub {
          font-size: 0.98rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.75rem 0;
        }

        .newsletter-form-card {
          background: var(--bg-secondary);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-card);
        }
        [data-theme='dark'] .newsletter-form-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .benefit-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 1.5rem;
          border-radius: 16px;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          box-shadow: var(--shadow-card);
          transition: transform 150ms ease, border-color 150ms ease;
        }
        .benefit-card:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-2px);
        }

        .benefit-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: var(--bg-secondary);
          color: var(--accent-primary);
          border: var(--border-width, 1px) solid var(--border-subtle);
        }
      `}</style>

      <div className="container-lg" style={{ paddingTop: '2rem', paddingBottom: '6rem' }}>
        {/* Modern Hero Banner Card */}
        <div className="newsletter-hero-card">
          <div className="newsletter-hero-grid">
            {/* Left Info Column */}
            <div>
              <div className="newsletter-pill-badge">
                <span>+ The Weekly Briefing</span>
              </div>

              <h1 className="newsletter-hero-heading">
                Stay ahead on AI without the noise
              </h1>

              <p className="newsletter-hero-sub">
                Get a weekly curated briefing of the most important AI tools, model releases, and practical workflow recipes delivered straight to your inbox.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  '5-minute read every Monday morning',
                  'Zero spam — 1-click unsubscribe anytime',
                  'Hand-tested AI tools & industry breakdowns',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <CheckCircle2 size={16} style={{ color: '#10B981', flexShrink: 0 }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sign-up Card Column */}
            <div className="newsletter-form-card">
              <div style={{ marginBottom: '1.25rem' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 6px 0', color: 'var(--text-primary)' }}>
                  Join the toolstaq Newsletter
                </h2>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)', margin: 0 }}>
                  Delivered every Monday. Safe, free, and unsubscribable in 1 click.
                </p>
              </div>

              <NewsletterForm />
            </div>
          </div>
        </div>

        {/* 3-Column Value Propositions Below Hero */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {[
            {
              icon: <Zap size={20} />,
              title: 'Weekly AI Recap',
              desc: 'A curated, 5-minute summary of the major model launches, benchmarks, and regulation news from the past 7 days.',
            },
            {
              icon: <Sparkles size={20} />,
              title: 'Curated Tool Spotlights',
              desc: 'Discover high-signal, fully verified AI coding, writing, and automation tools handpicked from the toolstaq directory.',
            },
            {
              icon: <ShieldCheck size={20} />,
              title: 'Privacy Guaranteed',
              desc: 'Your email address is strictly encrypted and never shared. No spam, no advertisements, unsubscribe whenever you like.',
            },
          ].map((benefit, i) => (
            <div key={i} className="benefit-card">
              <div className="benefit-icon-wrapper">
                {benefit.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
                  {benefit.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
