import type { Metadata } from 'next';
import { Bricolage_Grotesque, Inter_Tight, JetBrains_Mono } from 'next/font/google';
import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TalaChatWidget from '@/components/TalaChatWidget';
import { organizationJsonLd, site, absoluteUrl } from '@/lib/seo';
import './globals.css';

const displayFont = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display-src' });
const bodyFont = Inter_Tight({ subsets: ['latin'], variable: '--font-body-src' });
const monoFont = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono-src' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: 'TantaGlobal Assist — Professional VA Placement',
    template: '%s | TantaGlobal Assist',
  },
  description: site.description,
  alternates: {
    canonical: absoluteUrl('/'),
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: site.url,
    siteName: site.name,
    title: 'TantaGlobal Assist — Professional VA Placement',
    description: site.description,
    images: [
      {
        url: absoluteUrl('/og-home.svg'),
        width: 1200,
        height: 630,
        alt: 'TantaGlobal Assist',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TantaGlobal Assist — Professional VA Placement',
    description: site.description,
    images: [absoluteUrl('/og-home.svg')],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
        <TalaChatWidget />
      </body>
    </html>
  );
}
