import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getMeta } from '@/lib/tools';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'ToolStaq — Find the Best AI Tools',
    template: '%s | ToolStaq',
  },
  description:
    'The most comprehensive AI tools directory. Discover, compare, and filter AI tools by category, pricing, complexity and more.',
  keywords: ['AI tools', 'artificial intelligence', 'AI software', 'machine learning tools', 'AI directory'],
  metadataBase: new URL('https://aitoolsdirectory.com'),
  openGraph: {
    type: 'website',
    siteName: 'ToolStaq',
    title: 'ToolStaq — Find the Best AI Tools',
    description: 'Find the perfect AI tool for your workflow. Browse top tools across multiple categories.',
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolStaq',
    description: 'Discover the best AI tools across multiple categories.',
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
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: '1 0 auto', paddingTop: '64px' }}>
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
