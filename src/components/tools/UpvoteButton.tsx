'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface UpvoteButtonProps {
  toolSlug: string;
  initialUpvotes: number;
}

export default function UpvoteButton({ toolSlug, initialUpvotes }: UpvoteButtonProps) {
  const [upvotesCount, setUpvotesCount] = useState(initialUpvotes);
  const [hasVoted, setHasVoted] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const upvotedTools = JSON.parse(localStorage.getItem('upvoted_tools') || '[]');
      if (Array.isArray(upvotedTools) && upvotedTools.includes(toolSlug)) {
        setHasVoted(true);
        setUpvotesCount(initialUpvotes + 1);
      }
    } catch (e) {
      console.error('Failed to parse upvoted tools from localStorage', e);
    }
    setIsHydrated(true);
  }, [toolSlug, initialUpvotes]);

  const handleUpvote = () => {
    try {
      const upvotedTools = JSON.parse(localStorage.getItem('upvoted_tools') || '[]');
      let updatedList = [...upvotedTools];

      if (hasVoted) {
        // Retract vote
        updatedList = updatedList.filter((slug) => slug !== toolSlug);
        setUpvotesCount((c) => Math.max(initialUpvotes, c - 1));
        setHasVoted(false);
      } else {
        // Vote
        if (!updatedList.includes(toolSlug)) {
          updatedList.push(toolSlug);
        }
        setUpvotesCount((c) => c + 1);
        setHasVoted(true);
      }
      localStorage.setItem('upvoted_tools', JSON.stringify(updatedList));
    } catch (e) {
      console.error('Failed to save vote to localStorage', e);
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
          fontSize: '0.825rem',
          fontWeight: 600,
          background: hasVoted ? 'rgba(139, 92, 246, 0.08)' : 'rgba(255, 255, 255, 0.03)',
          border: hasVoted ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid var(--border-subtle)',
          borderRadius: '12px',
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
          background: ${hasVoted ? 'rgba(139, 92, 246, 0.12)' : 'rgba(255, 255, 255, 0.06)'} !important;
          border-color: ${hasVoted ? 'rgba(139, 92, 246, 0.4)' : 'var(--text-muted)'} !important;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-2px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
