import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

const routes = [
  '/',
  '/about',
  '/apply',
  '/contact',
  '/hire',
  '/how-it-works',
  '/pricing',
  '/privacy',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: absoluteUrl(route),
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.7,
  }));
}
