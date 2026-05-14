import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "TantaGlobal Assist — Hire Trained, Job-Ready Virtual Assistants",
    template: "%s | TantaGlobal Assist",
  },
  description:
    "TantaGlobal Assist connects businesses with trained, certified virtual assistants. Vetted candidates, professional placement, global workforce.",
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
      "Connect with trained, certified VAs. TantaGlobal Assist provides professional VA placement for businesses that need real results.",
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL("https://tantaglobal.com"),
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
