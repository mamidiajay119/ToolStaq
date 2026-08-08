"use client";

import React, { useState } from 'react';
import { ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions/subscribe';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append('email', email);
      
      const result = await subscribeToNewsletter(null, formData);
      
      if (result.success) {
        setStatus({ type: 'success', message: result.message || 'Subscribed successfully!' });
        setEmail('');
      } else {
        setStatus({ type: 'error', message: result.error || 'Failed to subscribe.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '0 auto', width: '100%' }}>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '10px',
        maxWidth: '420px',
        margin: '0 auto',
        justifyContent: 'center',
      }}>
        <input
          type="email"
          required
          disabled={isLoading}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          style={{
            flex: '1 1 260px',
            padding: '10px 14px',
            fontSize: '0.875rem',
            borderRadius: '8px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            outline: 'none',
          }}
        />
        <button 
          type="submit" 
          disabled={isLoading}
          className="btn-primary" 
          style={{ 
            padding: '10px 20px', 
            fontSize: '0.875rem', 
            borderRadius: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.8 : 1,
            justifyContent: 'center',
            minWidth: '120px',
          }}
        >
          {isLoading ? (
            <>
              Subscribed <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            </>
          ) : (
            <>
              Subscribe <ArrowRight size={14} />
            </>
          )}
        </button>
      </form>

      {status && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.85rem',
          color: status.type === 'success' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
          marginTop: '1rem',
          padding: '8px 12px',
          borderRadius: '8px',
          background: status.type === 'success' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(239, 68, 68, 0.05)',
          border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
        }}>
          {status.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}
