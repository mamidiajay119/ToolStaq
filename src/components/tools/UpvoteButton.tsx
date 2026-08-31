'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface UpvoteButtonProps {
  toolSlug: string;
  initialUpvotes: number; // Will start at 0
}

export default function UpvoteButton({ toolSlug, initialUpvotes }: UpvoteButtonProps) {
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // Generate or fetch client browser fingerprint UUID
    let fingerprint = localStorage.getItem('voting_fingerprint');
    if (!fingerprint) {
      fingerprint = 'fp_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('voting_fingerprint', fingerprint);
    }

    async function loadVotes() {
      try {
        // 1. Fetch total global votes for this tool
        const { count, error } = await supabase
          .from('tool_votes')
          .select('*', { count: 'exact', head: true })
          .eq('tool_slug', toolSlug);

        if (!error && count !== null) {
          setUpvotesCount(count);
        }

        // 2. Check if this browser has already voted
        const { data, error: checkError } = await supabase
          .from('tool_votes')
          .select('id')
          .eq('tool_slug', toolSlug)
          .eq('fingerprint', fingerprint)
          .maybeSingle();

        if (!checkError && data) {
          setHasVoted(true);
        }
      } catch (e) {
        console.error('Failed to load live votes from Supabase:', e);
      }
      setIsHydrated(true);
    }

    loadVotes();
  }, [toolSlug, initialUpvotes]);

  const handleUpvote = async () => {
    const fingerprint = localStorage.getItem('voting_fingerprint') || 'anonymous';
    const originalHasVoted = hasVoted;
    
    // Optimistic UI updates
    setHasVoted(!originalHasVoted);
    setUpvotesCount(c => originalHasVoted ? Math.max(0, c - 1) : c + 1);

    try {
      if (originalHasVoted) {
        // Retract vote in Supabase
        const { error } = await supabase
          .from('tool_votes')
          .delete()
          .eq('tool_slug', toolSlug)
          .eq('fingerprint', fingerprint);

        if (error) throw error;
      } else {
        // Cast vote in Supabase
        const { error } = await supabase
          .from('tool_votes')
          .insert({ tool_slug: toolSlug, fingerprint });

        if (error) throw error;
      }
    } catch (e) {
      console.error('Failed to update vote in Supabase:', e);
      // Revert optimistic updates on error
      setHasVoted(originalHasVoted);
      setUpvotesCount(c => originalHasVoted ? c + 1 : Math.max(0, c - 1));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
      <button
        onClick={handleUpvote}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '7px 16px',
          height: '36px',
          boxSizing: 'border-box',
          fontSize: '0.825rem',
          fontWeight: 600,
          background: hasVoted ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.04)',
          border: hasVoted ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255, 255, 255, 0.14)',
          borderRadius: '10px',
          color: hasVoted ? 'var(--accent-primary)' : 'var(--text-primary)',
          cursor: 'pointer',
          transition: 'all 150ms ease',
          outline: 'none',
        }}
        className="upvote-btn"
      >
        <Star
          size={14}
          fill={hasVoted ? 'var(--accent-primary)' : 'none'}
          color={hasVoted ? 'var(--accent-primary)' : 'currentColor'}
          style={{ transition: 'fill 150ms ease' }}
        />
        <span>{upvotesCount.toLocaleString()} upvotes</span>
      </button>
      
      {/* Dynamic visibility based on hydration & voting state */}
      {isHydrated && hasVoted && (
        <span style={{ 
          fontSize: '0.7rem', 
          color: 'var(--text-muted)', 
          paddingLeft: '4px',
          animation: 'fadeIn 200ms ease' 
        }}>
          Thanks for your vote.
        </span>
      )}

      <style>{`
        .upvote-btn:hover {
          background: ${hasVoted ? 'rgba(139, 92, 246, 0.14)' : 'rgba(255, 255, 255, 0.08)'} !important;
          border-color: ${hasVoted ? 'rgba(139, 92, 246, 0.5)' : 'rgba(255, 255, 255, 0.28)'} !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
