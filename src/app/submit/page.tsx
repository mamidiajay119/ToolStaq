'use client';

import { useState } from 'react';
import { Send, CheckCircle2, PlusCircle } from 'lucide-react';

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
  const [form, setForm] = useState({
    tool_name: '', url: '', category: '', description: '', email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission (replace with real API call)
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  if (submitted) {
    return (
      <div className="container-lg" style={{ paddingTop: '6rem', paddingBottom: '6rem', textAlign: 'center' }}>
        <div style={{
          maxWidth: '480px', margin: '0 auto',
          background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)',
          borderRadius: '24px', padding: '3rem 2rem',
        }}>
          <CheckCircle2 size={48} style={{ color: '#6ee7b7', marginBottom: '1.5rem' }} />
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.75rem' }}>Tool Submitted!</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            Thank you for contributing to the directory. We&apos;ll review <strong>{form.tool_name}</strong> and add it within 24–48 hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-lg" style={{ paddingTop: '3rem', paddingBottom: '5rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '0.75rem' }}>
            <PlusCircle size={24} style={{ color: 'var(--accent-violet)' }} />
            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em' }}>Submit a Tool</h1>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Know an AI tool we&apos;re missing? Add it to the directory for the community.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '2rem' }}>
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
                className="search-input"
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
                className="search-input"
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
                className="search-input"
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
                className="search-input"
                style={{ padding: '10px 14px', fontSize: '0.9rem', resize: 'vertical', minHeight: '100px', lineHeight: 1.6 }}
              />
            </div>

            <div>
              <label htmlFor="submitter-email" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Your Email (optional)
              </label>
              <input
                id="submitter-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="notify@me.com"
                className="search-input"
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
  );
}
