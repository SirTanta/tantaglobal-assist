import type { Metadata } from 'next';

export const site = {
  name: 'TantaGlobal Assist',
  shortName: 'TGA',
  description:
    'An employer waitlist for certified virtual assistants and certification-led training for candidates, from TantaGlobal Assist, a Tanta Holdings company.',
  url: 'https://tantaglobal.com',
  academyUrl: 'https://academy.tantaglobal.com',
  holdingsUrl: 'https://tantaholdings.com',
  facebookUrl: 'https://www.facebook.com/profile.php?id=867291873125261',
  youtubeUrl: 'https://www.youtube.com/@TantaRemote',
  email: 'info@tanta-holdings.com',
  // Mailbox behind the newsletter mailto fallback. Functioning mailbox, not the public contact address.
  newsletterMailbox: 'hello@tantaglobal.com',
} as const;

export function absoluteUrl(path = '/') {
  return new URL(path, site.url).toString();
}

export function pageMetadata({
  title,
  description,
  path,
  image,
  noIndex = false,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  noIndex?: boolean;
}): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image.startsWith('http') ? image : absoluteUrl(image);

  return {
    title,
    description,
    alternates: { canonical },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: 'website',
      url: canonical,
      siteName: site.name,
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: site.name,
  url: site.url,
  logo: `${site.url}/logo-transparent.png`,
  description: site.description,
  parentOrganization: {
    '@type': 'Organization',
    name: 'Tanta Holdings LLC',
    url: site.holdingsUrl,
  },
  sameAs: [site.youtubeUrl, site.facebookUrl],
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'sales',
      email: site.email,
      availableLanguage: ['en'],
    },
    {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: site.email,
      availableLanguage: ['en'],
    },
  ],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: site.name,
  url: site.url,
  description: site.description,
};
