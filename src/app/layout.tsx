import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const GA4_ID = "G-44MNCME40P";

export const metadata: Metadata = {
  metadataBase: new URL("https://tantaglobal.com"),
  title: {
    default: "TantaGlobal Assist — Hire Trained, Job-Ready Virtual Assistants",
    template: "%s | TantaGlobal Assist",
  },
  description:
    "TantaGlobal Assist connects US employers with certified virtual assistants and gives VA candidates a clear route into the placement pipeline.",
  keywords: [
    "hire virtual assistant",
    "VA placement",
    "trained virtual assistant",
    "remote staffing",
    "global VA",
    "TantaGlobal Assist",
    "VA certification",
    "remote workforce",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tantaglobal.com",
    siteName: "TantaGlobal Assist",
    title: "TantaGlobal Assist — Hire Trained, Job-Ready Virtual Assistants",
    description:
      "Connect with trained, certified VAs. Employers hire through a vetted pipeline and candidates apply to the pool.",
    images: [
      {
        url: "/og/home.svg",
        width: 1200,
        height: 630,
        alt: "TantaGlobal Assist — Hire Trained, Job-Ready Virtual Assistants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TantaGlobal Assist — Hire Trained, Job-Ready Virtual Assistants",
    description:
      "Connect with trained, certified VAs. Employers hire through a vetted pipeline and candidates apply to the pool.",
    images: ["/og/home.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "TantaGlobal Assist",
  url: "https://tantaglobal.com",
  description:
    "VA placement and staffing service. We connect businesses with trained, certified virtual assistants.",
  parentOrganization: {
    "@type": "Organization",
    name: "Tanta Holdings LLC",
    url: "https://tantaholdings.com",
  },
  sameAs: [
    "https://www.youtube.com/@TantaRemote",
    "https://www.facebook.com/profile.php?id=867291873125261",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <Script
          id="ga4-src"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`}
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA4_ID}');`}
        </Script>
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
