'use client';

import { useState } from 'react';
import { Send, CheckCircle2, PlusCircle, AlertCircle } from 'lucide-react';
import { submitTool } from '@/app/actions/submit-tool';

const CATEGORIES = [
  'AI Writing', 'AI Coding', 'AI Design', 'AI Video', 'AI Audio',
  'AI Automation', 'AI Marketing', 'AI Analytics', 'AI Productivity',
  'AI Research', 'AI Sales', 'AI Customer Support', 'AI HR',
  'AI Education', 'AI Legal', 'AI Finance', 'AI Healthcare',
  'AI Translation', 'AI Image', 'AI Chat', 'AI Security',
  'AI Data Extraction', 'AI Presentation', 'AI Social Media',
  'AI Voice', 'AI Avatar', 'AI Search',
];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    tool_name: '', url: '', category: '', description: '', email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await submitTool(form);
      if (result.success) {
        setSubmitted(true);
      } else {
        setError(result.error || "An error occurred while submitting.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (submitted) {
    return (
      <div className="container-lg" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          background: 'rgba(16,185,129,0.06)', border: 'var(--border-width, 1px) solid rgba(16,185,129,0.2)',
          borderRadius: '24px', padding: '3rem 2rem',
        }}>
          <CheckCircle2 size={36} style={{ color: '#6ee7b7', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.75rem' }}>Tool Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            Thank you for contributing to the directory. We&apos;ll review <strong>{form.tool_name}</strong> and add it within 24–48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        [data-theme='dark'] .hero-stats-row {
          border-top-color: rgba(255, 255, 255, 0.06) !important;
        }
        [data-theme='dark'] .hero-stats-row span:first-child {
          color: var(--text-primary) !important;
        }
        [data-theme='dark'] .hero-stats-row span:last-child {
          color: var(--text-secondary) !important;
        }
      `}</style>

      <div className="inner-hero" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Submit a Tool</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Know an AI tool we&apos;re missing? Add it to the directory for the community.</p>

        {/* Benefits Capsules */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '1.25rem', marginBottom: '1.75rem' }}>
          {['Boost SEO', 'Early Adopters', 'Product Feedback'].map((benefit) => (
            <span
              key={benefit}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.18)',
                borderRadius: '99px',
                padding: '4px 12px',
                fontSize: '0.72rem',
                color: '#FFFFFF',
                fontWeight: 500,
              }}
            >
              {benefit}
            </span>
          ))}
        </div>

        {/* Platform Stats Row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3rem',
          flexWrap: 'wrap',
          borderTop: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.15)',
          paddingTop: '1.75rem',
          maxWidth: '580px',
          width: '100%',
          margin: '0.5rem auto 0',
        }} className="hero-stats-row">
          {[
            { number: '24-48h', label: 'Review SLA' },
            { number: 'Active', label: 'SEO Backlink' },
            { number: '100% Free', label: 'Forever' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.35rem', fontWeight: 600, color: '#FFFFFF', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                {stat.number}
              </span>
              <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '3px' }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="container-lg" style={{ paddingBottom: '5rem' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>

        <div className="glass-card" style={{ padding: '2rem' }}>
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: 'var(--border-width, 1px) solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#f87171',
              fontSize: '0.85rem',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label htmlFor="tool-name" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Tool Name *
              </label>
              <input
                id="tool-name"
                type="text"
                required
                value={form.tool_name}
                onChange={(e) => update('tool_name', e.target.value)}
                placeholder="e.g. Jasper AI"
                className="contact-input"
                style={{ padding: '10px 14px', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label htmlFor="tool-url" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Website URL *
              </label>
              <input
                id="tool-url"
                type="url"
                required
                value={form.url}
                onChange={(e) => update('url', e.target.value)}
                placeholder="https://example.com"
                className="contact-input"
                style={{ padding: '10px 14px', fontSize: '0.9rem' }}
              />
            </div>

            <div>
              <label htmlFor="tool-category" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Category *
              </label>
              <select
                id="tool-category"
                required
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="contact-input"
                style={{ padding: '10px 14px', fontSize: '0.9rem', cursor: 'pointer' }}
              >
                <option value="">Select a category...</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="tool-description" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Brief Description
              </label>
              <textarea
                id="tool-description"
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                placeholder="What does this tool do? Who is it best for?"
                rows={4}
                className="contact-input"
                style={{ padding: '10px 14px', fontSize: '0.9rem', resize: 'vertical', minHeight: '100px', lineHeight: 1.6 }}
              />
            </div>

            <div>
              <label htmlFor="submitter-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Your Email *
              </label>
              <input
                id="submitter-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="Enter your email address"
                className="contact-input"
                style={{ padding: '10px 14px', fontSize: '0.9rem' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                We&apos;ll notify you when your tool is approved.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ justifyContent: 'center', padding: '12px', fontSize: '0.95rem', opacity: loading ? 0.7 : 1 }}
              id="submit-tool-btn"
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                  Submitting...
                </span>
              ) : (
                <><Send size={15} /> Submit Tool</>
              )}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </>
  );
}
