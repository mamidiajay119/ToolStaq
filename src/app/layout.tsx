import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getMeta } from '@/lib/tools';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'AI Tools Directory — Discover 2,688+ AI Tools',
    template: '%s | AI Tools Directory',
  },
  description:
    'The most comprehensive AI tools directory. Discover, compare, and filter 2,688+ AI tools by category, pricing, complexity and more.',
  keywords: ['AI tools', 'artificial intelligence', 'AI software', 'machine learning tools', 'AI directory'],
  metadataBase: new URL('https://aitoolsdirectory.com'),
  openGraph: {
    type: 'website',
    siteName: 'AI Tools Directory',
    title: 'AI Tools Directory — Discover 2,688+ AI Tools',
    description: 'Find the perfect AI tool for your workflow. 2,688+ tools across 27 categories.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Tools Directory',
    description: 'Discover 2,688+ AI tools across 27 categories.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ThemeProvider>
          <Header />
          <main style={{ minHeight: '100vh', paddingTop: '64px' }}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
