'use client';

import { useState, useMemo } from 'react';
import ToolCard from '@/components/tools/ToolCard';
import type { Tool } from '@/types/tool';

interface CategoryToolsClientProps {
  tools: Tool[];
}

const PER_PAGE = 24;

export default function CategoryToolsClient({ tools }: CategoryToolsClientProps) {
  const [page, setPage] = useState(1);

  const paginated = useMemo(() => tools.slice(0, page * PER_PAGE), [tools, page]);

  return (
    <>
      {/* Tool Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: '14px',
        marginBottom: '2rem',
      }}>
        {paginated.map((tool, i) => (
          <ToolCard key={tool.slug} tool={tool} rank={i < 3 && page === 1 ? i + 1 : undefined} />
        ))}
      </div>

      {paginated.length < tools.length && (
        <div style={{ textAlign: 'center', marginTop: '2.5rem', marginBottom: '0.5rem' }}>
          <button 
            onClick={() => setPage((p) => p + 1)} 
            className="btn-secondary" 
            style={{ padding: '8px 24px', borderRadius: '12px' }}
          >
            Load more
          </button>
        </div>
      )}
    </>
  );
}
