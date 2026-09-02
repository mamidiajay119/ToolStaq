'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactForm } from '@/app/actions/contact';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('subject', subject);
      formData.append('message', message);

      const result = await submitContactForm(null, formData);

      if (result.success) {
        setStatus({ type: 'success', message: result.message || 'Message sent!' });
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to send message.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <style>{`
        /* ── Hero Card Banner Standard ── */
        .contact-hero-card {
          position: relative;
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 24px;
          padding: 2.75rem 3rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
          overflow: hidden;
          transition: background var(--transition-base), border-color var(--transition-base), box-shadow var(--transition-base);
        }
        [data-theme='dark'] .contact-hero-card {
          background: linear-gradient(135deg, #0d091b 0%, #140d28 50%, #0e0a1d 100%);
          border: 1px solid rgba(139, 92, 246, 0.2);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        @media (max-width: 640px) {
          .contact-hero-card { padding: 2.25rem 1.5rem; }
        }

        .contact-pill-badge {
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
        [data-theme='dark'] .contact-pill-badge {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
          color: #ededed;
        }

        .contact-hero-heading {
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.035em;
          color: var(--text-primary);
          margin: 0 0 0.85rem 0;
        }
        @media (min-width: 640px) {
          .contact-hero-heading { font-size: 2.85rem; }
        }

        .contact-hero-sub {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--text-secondary);
          margin: 0;
          max-width: 620px;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (min-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr 340px;
          }
        }
        .contact-info-card {
          background: var(--bg-card);
          border: var(--border-width, 1px) solid var(--border-subtle);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          box-shadow: var(--shadow-card);
        }
        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }
        .info-icon {
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
      `}</style>

      {/* Hero Card Banner */}
      <div className="container-xl" style={{ paddingTop: '1.25rem', paddingBottom: '1.5rem' }}>
        <div className="contact-hero-card">
          <div className="contact-pill-badge">
            <span>+ Get in touch</span>
          </div>

          <h1 className="contact-hero-heading">
            Contact &amp; Support
          </h1>

          <p className="contact-hero-sub">
            Have questions about listing your AI software, partnership inquiries, or directory feedback? We&apos;d love to connect.
          </p>
        </div>
      </div>

      <div className="container-xl" style={{ paddingBottom: '5rem' }}>
        <div className="contact-grid">
          
          {/* Left Column: Form Card */}
          <div style={{
            background: 'var(--bg-card)',
            border: 'var(--border-width, 1px) solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '2.5rem 2rem',
            boxShadow: 'var(--shadow-card)',
          }}>
            {status && status.type === 'success' ? (
              <div style={{
                textAlign: 'center',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
              }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-emerald)',
                }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
                  Message Sent Successfully
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0, maxWidth: '420px' }}>
                  {status.message}
                </p>
                <button
                  onClick={() => setStatus(null)}
                  className="btn-secondary"
                  style={{ marginTop: '1rem', padding: '10px 20px', borderRadius: '12px' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                  Send us a Message
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Name</label>
                    <input
                      type="text"
                      required
                      disabled={isLoading}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="contact-input"
                    />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Your Email</label>
                    <input
                      type="email"
                      required
                      disabled={isLoading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="contact-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Subject</label>
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Sponsorship Inquiry, Bug Report, etc."
                    className="contact-input"
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Message</label>
                  <textarea
                    required
                    disabled={isLoading}
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry in detail..."
                    className="contact-input"
                    style={{ resize: 'vertical' }}
                  />
                </div>

                {status && status.type === 'error' && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '0.85rem',
                    color: 'var(--accent-rose)',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: 'var(--border-width, 1px) solid rgba(239, 68, 68, 0.15)',
                  }}>
                    <AlertCircle size={16} />
                    <span>{status.message}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'flex-start',
                    gap: '6px',
                    padding: '9px 18px',
                    borderRadius: '10px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {isLoading ? (
                    <>
                      Sending message <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                    </>
                  ) : (
                    <>
                      Send message <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.85 }} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Info Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="contact-info-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em', borderBottom: 'var(--border-width, 1px) solid var(--border-subtle)', paddingBottom: '10px' }}>
                Contact Info
              </h3>
              
              {/* Response Time Item */}

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>Response Time</h4>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    We usually respond to all inquiries within 24-48 business hours.
                  </p>
                </div>
              </div>
            </div>

            {/* List Your Tool CTA Card */}
            <div style={{
              background: 'var(--bg-card)',
              border: 'var(--border-width, 1px) solid var(--border-subtle)',
              borderRadius: '16px',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: 'var(--shadow-card)',
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, letterSpacing: '-0.01em' }}>
                List Your AI Tool
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Are you an AI builder? Submit your tool to our hand-curated directory and put it in front of thousands of creators.
              </p>
              <Link
                href="/submit"
                className="btn-secondary"
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  textAlign: 'center',
                  justifyContent: 'center',
                  marginTop: '4px',
                }}
              >
                Expedite Submission
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
