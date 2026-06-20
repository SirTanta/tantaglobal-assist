import type { MetadataRoute } from 'next';
import { site } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*',              allow: '/' },
      { userAgent: 'GPTBot',         allow: '/' },
      { userAgent: 'ClaudeBot',      allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'PerplexityBot',  allow: '/' },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
