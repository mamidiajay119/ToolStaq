'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Clock, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

      {/* Hero */}
      <div className="inner-hero" style={{ marginBottom: '3rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '99px',
          background: 'rgba(255, 255, 255, 0.15)',
          border: 'var(--border-width, 1px) solid rgba(255, 255, 255, 0.25)',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '1.25rem',
        }}>
          <span>CONTACT SUPPORT</span>
        </div>
        <h1 style={{ color: '#FFFFFF', textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>Get in Touch</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.95)', textShadow: '0 1px 2px rgba(0,0,0,0.1)', maxWidth: '520px', margin: '0 auto' }}>
          Have questions, feedback, or sponsorship inquiries? We&apos;d love to hear from you.
        </p>
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
                    gap: '8px',
                    padding: '12px 24px',
                    borderRadius: '10px',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                  }}
                >
                  {isLoading ? (
                    <>
                      Sending Message <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                    </>
                  ) : (
                    <>
                      Send Message <Send size={16} />
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
              
              <div className="info-item">
                <div className="info-icon">
                  <Mail size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px 0' }}>Support & Operations</h4>
                  <a href="mailto:support@toolstaq.com" style={{ fontSize: '0.825rem', color: 'var(--accent-primary)', textDecoration: 'none' }}>
                    support@toolstaq.com
                  </a>
                </div>
              </div>

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
