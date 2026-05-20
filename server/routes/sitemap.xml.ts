const routePriority: Record<string, string> = {
  "/": "1.0",
  "/wisata": "0.9",
  "/kuliner": "0.9",
  "/budaya": "0.9",
  "/sejarah": "0.8",
  "/pendidikan": "0.8",
  "/teknologi": "0.7",
  "/peta": "0.7",
  "/filosofi": "0.8",
};

const routeChangeFrequency: Record<string, string> = {
  "/": "weekly",
  "/wisata": "weekly",
  "/kuliner": "weekly",
  "/budaya": "monthly",
  "/sejarah": "monthly",
  "/pendidikan": "monthly",
  "/teknologi": "monthly",
  "/peta": "monthly",
  "/filosofi": "monthly",
};

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default defineEventHandler((event) => {
  const config = useRuntimeConfig(event);
  const siteUrl = config.public.siteUrl.replace(/\/$/, "");
  const routes = config.public.indexedRoutes as string[];
  const lastmod = new Date().toISOString();

  const urls = routes
    .map((route) => {
      const loc = route === "/" ? siteUrl : `${siteUrl}${route}`;
      const priority = routePriority[route] ?? "0.6";
      const changefreq = routeChangeFrequency[route] ?? "monthly";

      return [
        "  <url>",
        `    <loc>${escapeXml(loc)}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        "  </url>",
      ].join("\n");
    })
    .join("\n");

  setHeader(event, "content-type", "application/xml; charset=utf-8");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
  ].join("\n");
});
