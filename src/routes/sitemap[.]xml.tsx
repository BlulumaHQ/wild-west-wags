import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = "https://wildwestwags.ca";
        const paths = ["/", "/about", "/services", "/blog", "/contact"];
        try {
          const r = await fetch("https://cms.wildwestwags.ca/wp-json/wp/v2/posts?per_page=100&_fields=slug,modified");
          if (r.ok) for (const p of (await r.json()) as { slug: string }[]) paths.push(`/blog/${p.slug}`);
        } catch {
          /* CMS unavailable */
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
          .map((p) => `<url><loc>${base}${p}</loc></url>`)
          .join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
