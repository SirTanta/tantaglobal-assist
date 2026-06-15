import type { MetadataRoute } from "next";

const baseUrl = "https://tantaglobal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/",
    "/employers",
    "/pricing",
    "/va-pool/hire",
    "/va-pool/apply",
    "/about",
    "/how-it-works",
    "/contact",
    "/privacy-policy",
    "/terms-of-service",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
