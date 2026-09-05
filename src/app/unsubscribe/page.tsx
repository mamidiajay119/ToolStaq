'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, CheckCircle2, AlertCircle, Loader2, ChevronRight } from 'lucide-react';

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: data.message || 'You have been unsubscribed from toolstaq updates.',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to unsubscribe. Please try again.',
        });
      }
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: 'An unexpected network error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '0 auto',
      background: 'var(--bg-card)',
      border: 'var(--border-width, 1px) solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '2.5rem 2rem',
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
      textAlign: 'center',
    }}>
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1.25rem',
        color: 'var(--accent-primary)',
      }}>
        <Mail size={24} />
      </div>

      <h1 style={{ fontSize: '1.6rem', fontWeight: 750, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
        Unsubscribe from <span className="brand-text">toolstaq</span>
      </h1>
      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.75rem' }}>
        We are sorry to see you go. Enter your email below to opt out of our weekly AI news briefings.
      </p>

      {status?.type === 'success' ? (
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          color: '#10b981',
          fontSize: '0.9rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle2 size={24} />
          <span>{status.message}</span>
        </div>
      ) : (
        <form onSubmit={handleUnsubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {status?.type === 'error' && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '0.85rem',
              color: '#ef4444',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}>
              <AlertCircle size={16} />
              <span>{status.message}</span>
            </div>
          )}

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="news-search-bar"
            style={{
              padding: '10px 16px',
              fontSize: '0.9rem',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            className="btn-primary banner-cta-btn"
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              width: '100%',
              justifyContent: 'center',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? (
              <>
                Processing... <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
              </>
            ) : (
              'Confirm Unsubscribe'
            )}
          </button>
        </form>
      )}

      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', marginTop: '1.25rem' }}>
        <Link
          href="/"
          className="btn-secondary banner-cta-btn"
          style={{
            padding: '8px 16px',
            borderRadius: '10px',
            fontSize: '0.85rem',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            justifyContent: 'center',
            textDecoration: 'none',
          }}
        >
          Back to toolstaq homepage <ChevronRight size={15} strokeWidth={2.5} style={{ opacity: 0.75 }} />
        </Link>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="container-xl" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
      <Suspense fallback={
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
          Loading...
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
