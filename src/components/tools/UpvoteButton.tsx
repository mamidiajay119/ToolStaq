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
  const [showThanks, setShowThanks] = useState(false);
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
    const isCastingVote = !originalHasVoted;
    
    // Optimistic UI updates
    setHasVoted(isCastingVote);
    setUpvotesCount(c => originalHasVoted ? Math.max(0, c - 1) : c + 1);

    if (isCastingVote) {
      setShowThanks(true);
      setTimeout(() => {
        setShowThanks(false);
      }, 3500);
    } else {
      setShowThanks(false);
    }

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
      setShowThanks(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
      <button
        onClick={handleUpvote}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 18px',
          height: '38px',
          boxSizing: 'border-box',
          fontSize: '0.85rem',
          fontWeight: 600,
          background: hasVoted ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-secondary)',
          border: hasVoted ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid var(--border-subtle)',
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
      
      {/* Dynamic thanks message auto-dismisses after 3.5 seconds */}
      {showThanks && (
        <span style={{ 
          fontSize: '0.80rem', 
          fontWeight: 500,
          color: 'var(--text-secondary)', 
          whiteSpace: 'nowrap',
          animation: 'fadeInOut 3.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' 
        }}>
          Thanks for your vote.
        </span>
      )}

      <style>{`
        .upvote-btn:hover {
          background: ${hasVoted ? 'rgba(139, 92, 246, 0.14)' : 'var(--bg-card)'} !important;
          border-color: ${hasVoted ? 'rgba(139, 92, 246, 0.5)' : 'var(--accent-primary)'} !important;
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-4px); }
          12% { opacity: 1; transform: translateX(0); }
          82% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-4px); }
        }
      `}</style>
    </div>
  );
}
