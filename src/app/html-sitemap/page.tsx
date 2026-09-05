import type { Metadata } from 'next';
import Link from 'next/link';
import { Layers, Cpu, Wrench, Shield, ExternalLink } from 'lucide-react';
import { getAllTools, getAllCategoriesAsync, slugifyCategory } from '@/lib/tools';
import { getAllProviders } from '@/lib/providers';
import { getAbsoluteUrl } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Sitemap — Directory Index',
  description: 'Structured visual sitemap index for toolstaq. Access all AI categories, model providers, and platform pages.',
  alternates: {
    canonical: getAbsoluteUrl('/html-sitemap'),
  },
  openGraph: {
    title: 'Sitemap — toolstaq Directory Index',
    description: 'Structured visual sitemap index of all AI categories, model providers, and platform pages.',
    url: getAbsoluteUrl('/html-sitemap'),
  },
};

export default async function HtmlSitemapPage() {
  const [tools, categories, providers] = await Promise.all([
    getAllTools(),
    getAllCategoriesAsync(),
    getAllProviders(),
  ]);

  // Derive tool counts per category
  const categoryCounts: Record<string, number> = {};
  tools.forEach((t) => {
    t.category.forEach((c) => {
      categoryCounts[c] = (categoryCounts[c] || 0) + 1;
    });
  });

  const mainPages = [
    { label: 'Home Page', href: '/' },
    { label: 'All AI Tools Directory', href: '/tools' },
    { label: 'All Categories Index', href: '/categories' },
    { label: 'Model Providers & Labs Index', href: '/providers' },
    { label: 'Compare AI Tools', href: '/compare' },
    { label: 'AI News & Trends', href: '/news' },
    { label: 'Newsletter Digest', href: '/newsletter' },
    { label: 'Submit a Tool', href: '/submit' },
    { label: 'Contact Us', href: '/contact' },
  ];

  const legalPages = [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookie-policy' },
    { label: 'XML Sitemap (For Search Bots)', href: '/sitemap.xml', external: true },
  ];

  return (
    <div className="container-xl" style={{ padding: '3.5rem 1.5rem 6rem' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '3rem', textAlign: 'left' }}>
        <div className="monochrome-pill-badge" style={{ marginBottom: '1rem' }}>
          <span>+ Directory Index</span>
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Sitemap
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', lineHeight: 1.6 }}>
          Structured directory index of toolstaq pages, AI research labs, and tool categories.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Card 1: Main Navigation */}
        <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '2rem 2.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Layers size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Main Navigation
            </h2>
          </div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {mainPages.map((item) => (
              <li key={item.href} style={{ color: 'var(--accent-primary)' }}>
                <Link href={item.href} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Card 2: Model Providers */}
        <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '2rem 2.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Model Providers &amp; Research Labs ({providers.length})
            </h2>
          </div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px' }}>
            {providers.map((p) => (
              <li key={p.slug} style={{ color: 'var(--accent-primary)' }}>
                <Link href={`/providers/${p.slug}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        {/* Card 3: Tool Categories */}
        <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '2rem 2.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Tool Categories ({categories.length})
            </h2>
          </div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            {categories.map((cat) => {
              const count = categoryCounts[cat] || 0;
              const catSlug = slugifyCategory(cat);

              return (
                <li key={cat} style={{ color: 'var(--accent-primary)' }}>
                  <Link href={`/category/${catSlug}`} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500 }}>
                    {cat}
                  </Link>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '6px' }}>
                    ({count} {count === 1 ? 'tool' : 'tools'})
                  </span>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Card 4: Legal & Protocols */}
        <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '24px', padding: '2rem 2.25rem', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={18} />
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Legal &amp; System Protocols
            </h2>
          </div>
          <ul style={{ paddingLeft: '1.25rem', margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {legalPages.map((item) => (
              <li key={item.href} style={{ color: 'var(--accent-primary)' }}>
                <Link href={item.href} style={{ color: 'var(--text-primary)', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  {item.label}
                  {item.external && <ExternalLink size={13} style={{ opacity: 0.7 }} />}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
