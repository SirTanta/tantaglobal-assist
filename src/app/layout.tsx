import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { organizationJsonLd, site, absoluteUrl } from '@/lib/seo';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

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
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
