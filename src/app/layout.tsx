import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { siteConfig, getOgImageUrl } from '@/lib/siteConfig';
import { PostHogProvider } from '@/components/providers/PostHogProvider';

const defaultOgImage = getOgImageUrl({
  title: siteConfig.title,
  subtitle: siteConfig.description,
  type: 'AI Directory',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: 'toolstaq — %s',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'toolstaq — The Intelligent Index for Frontier AI Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon.png', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/icon.png',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
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
        <PostHogProvider>
          <ScrollToTop />
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: '1 0 auto', paddingTop: '76px' }}>
              {children}
            </main>
            <Footer />
          </div>
          <Analytics />
        </PostHogProvider>
      </body>
    </html>
  );
}
