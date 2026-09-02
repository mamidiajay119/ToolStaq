import type { Metadata } from 'next';
import { Mail, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import NewsletterForm from '@/components/news/NewsletterForm';

export const metadata: Metadata = {
  title: 'Subscribe to the toolstaq Newsletter — Stay Ahead on AI',
  description: 'Get weekly breakdowns of top AI tools, new model releases, and practical workflow recipes delivered straight to your inbox.',
};

export default function NewsletterPage() {
  return (
    <>
      <style>{`
        .benefit-row {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          text-align: left;
          padding: 1.25rem;
          border-radius: 12px;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          box-shadow: var(--shadow-card);
          transition: transform 150ms ease, border-color 150ms ease;
        }
        .benefit-row:hover {
          border-color: var(--accent-primary) !important;
          transform: translateY(-1px);
        }
        .benefit-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background: var(--bg-secondary);
          color: var(--accent-primary);
          flex-shrink: 0;
          border: var(--border-width, 1px) solid var(--border-subtle);
        }
        .newsletter-hero {
          position: relative;
          text-align: center;
          max-width: 680px;
          margin: 0 auto 3rem;
        }
        .newsletter-hero::before {
          content: "";
          position: absolute;
          top: -20px;
          left: 50%;
          transform: translateX(-50%);
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 70%);
          filter: blur(25px);
          pointer-events: none;
          z-index: -1;
        }
      `}</style>

      <div className="inner-hero" style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="newsletter-hero" style={{ margin: 0 }}>
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
            <Sparkles size={12} color="#FFFFFF" />
            <span>THE WEEKLY BRIEFING</span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: 500,
            color: '#FFFFFF',
            lineHeight: 1.2,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
          }}>
            Stay ahead on AI without the noise
          </h1>
          
          <p style={{
            fontSize: '0.95rem',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: 1.6,
            margin: '0 auto',
            maxWidth: '520px',
            textShadow: '0 1px 2px rgba(0, 0, 0, 0.15)'
          }}>
            Get a weekly curated briefing of the most important AI tools, releases, and news sent straight to your inbox.
          </p>
        </div>
      </div>

      <div className="container-lg" style={{ paddingBottom: '7rem' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>

          {/* Core Sign-Up Form Box */}
          <div className="glass-card" style={{
            padding: '2.5rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            background: 'var(--bg-card)',
            border: 'var(--border-width, 1px) solid var(--border-subtle)',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Join the toolstaq Newsletter
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0, marginTop: '-0.75rem' }}>
              Delivered every Sunday. Safe, free, and unsubscribable in 1 click.
            </p>
            
            <NewsletterForm />
          </div>

          {/* Value Propositions / Benefits list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '1rem' }}>
            {[
              {
                icon: <Zap size={18} />,
                title: 'Weekly AI Recap',
                desc: 'A curated, 5-minute summary of the major model launches, benchmarks, and regulation news from the past 7 days.'
              },
              {
                icon: <Sparkles size={18} />,
                title: 'Curated Tool Spotlights',
                desc: 'Discover high-signal, fully verified AI coding, writing, and automation tools handpicked from the toolstaq directory.'
              },
              {
                icon: <ShieldCheck size={18} />,
                title: 'Privacy Guaranteed',
                desc: 'Your email address is strictly encrypted and never shared. No spam, no advertisements, unsubscribe whenever you like.'
              }
            ].map((benefit, i) => (
              <div key={i} className="benefit-row">
                <div className="benefit-icon">
                  {benefit.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <h3 style={{ fontSize: '0.925rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    {benefit.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
