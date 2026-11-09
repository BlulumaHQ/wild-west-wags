import { createFileRoute } from "@tanstack/react-router";
import { LOCAL_POSTS } from "@/lib/blog/local";
import { USE_WORDPRESS_BLOG } from "@/lib/blog/config";
import { wpFetch } from "@/lib/blog/wordpress";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const base = "https://wildwestwags.ca";
        const paths = ["/", "/about", "/services", "/blog", "/contact"];
        if (USE_WORDPRESS_BLOG) {
          try {
            const r = await wpFetch("/posts?per_page=100&_fields=slug");
            if (r.ok) for (const p of (await r.json()) as { slug: string }[]) paths.push(`/blog/${p.slug}`);
          } catch {
            /* CMS unavailable */
          }
        } else {
          for (const p of LOCAL_POSTS) paths.push(`/blog/${p.slug}`);
        }
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths
          .map((p) => `<url><loc>${base}${p}</loc></url>`)
          .join("")}</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
