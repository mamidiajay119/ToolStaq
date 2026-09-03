import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { getMeta } from '@/lib/tools';

export const metadata: Metadata = {
  title: {
    default: 'toolstaq - The Intelligent Index for Frontier AI Tools',
    template: 'toolstaq - %s',
  },
  description:
    'The most comprehensive AI tools directory. Discover, compare, and filter AI tools by category, pricing, complexity and more.',
  keywords: ['AI tools', 'artificial intelligence', 'AI software', 'machine learning tools', 'AI directory'],
  metadataBase: new URL('https://aitoolsdirectory.com'),
  openGraph: {
    type: 'website',
    siteName: 'toolstaq',
    title: 'toolstaq — Find the Best AI Tools',
    description: 'Find the perfect AI tool for your workflow. Browse top tools across multiple categories.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'toolstaq',
    description: 'Discover the best AI tools across multiple categories.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32' },
    ],
    apple: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

// Inline script runs synchronously during HTML parsing — before first paint —
// and sets data-theme from localStorage so there is no flash of wrong theme.
// Next.js 16 recommended pattern:
// node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}else if(window.matchMedia('(prefers-color-scheme: dark)').matches){document.documentElement.setAttribute('data-theme','dark')}else{document.documentElement.setAttribute('data-theme','light')}}catch(e){}})()`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Theme detection: server renders type="text/javascript" so browser executes it
            during HTML parsing (before first paint). On client hydration it becomes
            type="text/plain" so React doesn't warn. suppressHydrationWarning handles
            the type mismatch. Per Next.js 16 docs: preventing-flash-before-hydration.md */}
        <script
          type={typeof window === 'undefined' ? 'text/javascript' : 'text/plain'}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Header />
          <main style={{ flex: '1 0 auto', paddingTop: '76px' }}>
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
