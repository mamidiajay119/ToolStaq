'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, PlusCircle, AlertCircle, Plus, ChevronRight, Clock, Link2, ShieldCheck, Zap } from 'lucide-react';
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
      <div className="container-lg" style={{ paddingTop: '5rem', paddingBottom: '6rem' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card"
          style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 2rem', textAlign: 'center' }}
        >
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Tool Submitted!
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            Thank you for submitting <strong>{form.tool_name}</strong>. Our editorial team will review your application within 24–48 hours.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({ tool_name: '', url: '', category: '', description: '', email: '' });
            }}
            className="btn-secondary"
            style={{ padding: '10px 20px', fontSize: '0.9rem' }}
          >
            Submit Another Tool
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .submit-hero-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          margin-bottom: 2.5rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          position: relative;
          overflow: hidden;
        }
        [data-theme='dark'] .submit-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .submit-hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
          align-items: center;
        }
        @media (min-width: 900px) {
          .submit-hero-grid { grid-template-columns: 1.1fr 0.9fr; }
        }

        .submit-pill-badge {
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
        [data-theme='dark'] .submit-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .submit-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 1rem 0;
        }

        .submit-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0 0 1.5rem 0;
          max-width: 500px;
        }

        .submit-highlight-matrix {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          position: relative;
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
        }

        .submit-matrix-cell {
          height: 110px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 1rem;
        }
        .sub-cell-top-left { border-right: 1px solid var(--border-subtle); border-bottom: 1px solid var(--border-subtle); }
        .sub-cell-top-right { border-bottom: 1px solid var(--border-subtle); }
        .sub-cell-bot-left { border-right: 1px solid var(--border-subtle); }

        .submit-crosshair {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--border-subtle);
          font-size: 16px;
          font-weight: 300;
          font-family: monospace;
          pointer-events: none;
          z-index: 5;
          user-select: none;
        }

        /* ── Full Width Form Card ── */
        .submit-form-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.5rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
          width: 100%;
        }
        @media (max-width: 768px) {
          .submit-form-card { padding: 1.75rem 1.5rem; }
        }

        .submit-form-layout {
          display: grid;
          grid-template-columns: 1fr;
          gap: 2.5rem;
        }
        @media (min-width: 900px) {
          .submit-form-layout { grid-template-columns: 320px 1fr; }
        }

        .submit-inputs-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.25rem;
        }
        @media (min-width: 640px) {
          .submit-inputs-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>

      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '1rem' }}>
        <div className="submit-hero-card">
          <div className="submit-hero-grid">
            <div>
              <div className="submit-pill-badge">
                <span>+ Community Submission</span>
              </div>

              <h1 className="submit-hero-heading">
                List your AI tool<br />
                on <span className="brand-text">toolstaq</span>
              </h1>

              <p className="submit-hero-sub">
                Reach thousands of developers, founders, and AI enthusiasts searching for new software daily. Fast editorial review with zero listing fees.
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    const formEl = document.getElementById('submit-form-box');
                    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-primary"
                  style={{
                    padding: '9px 18px',
                    borderRadius: '10px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Submit your tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div className="submit-highlight-matrix">
                {[
                  { stat: '4–48h', label: 'Review SLA', class: 'sub-cell-top-left', color: 'var(--accent-primary)' },
                  { stat: 'Active', label: 'SEO Backlink', class: 'sub-cell-top-right', color: '#0891b2' },
                  { stat: '100% Free', label: 'Forever', class: 'sub-cell-bot-left', color: '#059669' },
                  { stat: '2,700+', label: 'Directory Tools', class: '', color: '#d97706' },
                ].map((item, idx) => (
                  <div key={item.label} className={`submit-matrix-cell ${item.class}`}>
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3.2 + idx * 0.3, repeat: Infinity, ease: 'easeInOut', delay: idx * 0.2 }}
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 700,
                        color: item.color,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                      }}
                    >
                      {item.stat}
                    </motion.span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {item.label}
                    </span>
                  </div>
                ))}

                <div className="submit-crosshair">+</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-xl" style={{ paddingBottom: '5rem' }}>
        <div id="submit-form-box" className="submit-form-card">
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: 'var(--border-width, 1px) solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
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

          <div className="submit-form-layout">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderRight: '1px solid var(--border-subtle)', paddingRight: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--accent-primary)' }}>
                  Listing Guidelines
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', marginBottom: '6px' }}>
                  Submit your product
                </h3>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Provide complete details to ensure your tool gets indexed quickly.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                {[
                  { icon: <Clock size={16} color="var(--accent-primary)" />, title: '4–48h Review SLA', desc: 'Manual editorial verification by our team.' },
                  { icon: <Link2 size={16} color="#0891b2" />, title: 'Dofollow SEO Link', desc: 'Direct backlink to boost your site authority.' },
                  { icon: <ShieldCheck size={16} color="#059669" />, title: '100% Free Forever', desc: 'No hidden listing fees or subscriptions.' },
                  { icon: <Zap size={16} color="#d97706" />, title: 'High Discovery', desc: 'Shown to thousands of AI builders daily.' },
                ].map((item) => (
                  <div key={item.title} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <div style={{
                      width: '32px', height: '32px', borderRadius: '8px',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {item.icon}
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.title}
                      </span>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.3, marginTop: '2px' }}>
                        {item.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="submit-inputs-grid">
                  <div>
                    <label htmlFor="tool-name" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
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
                      style={{ padding: '11px 14px', fontSize: '0.9rem', width: '100%' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="tool-url" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
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
                      style={{ padding: '11px 14px', fontSize: '0.9rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div className="submit-inputs-grid">
                  <div>
                    <label htmlFor="tool-category" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      Category *
                    </label>
                    <select
                      id="tool-category"
                      required
                      value={form.category}
                      onChange={(e) => update('category', e.target.value)}
                      className="contact-input"
                      style={{ padding: '11px 14px', fontSize: '0.9rem', cursor: 'pointer', width: '100%' }}
                    >
                      <option value="">Select a category...</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="submitter-email" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
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
                      style={{ padding: '11px 14px', fontSize: '0.9rem', width: '100%' }}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="tool-description" style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    Brief Description
                  </label>
                  <textarea
                    id="tool-description"
                    value={form.description}
                    onChange={(e) => update('description', e.target.value)}
                    placeholder="What does this tool do? Who is it best for?"
                    rows={4}
                    className="contact-input"
                    style={{ padding: '12px 14px', fontSize: '0.9rem', resize: 'vertical', minHeight: '110px', lineHeight: 1.6, width: '100%' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', paddingTop: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    We&apos;ll notify you by email when your tool goes live.
                  </span>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                      padding: '11px 28px',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      opacity: loading ? 0.7 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                    id="submit-tool-btn"
                  >
                    {loading ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }} />
                        Submitting...
                      </span>
                    ) : (
                      <>Submit Tool <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.8 }} /></>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );
}
