import type { BlogListResult, BlogPost, BlogPostResult } from "./types";
import { WORDPRESS_API_BASE, WORDPRESS_PUBLIC_API_BASE } from "./config";

/**
 * Active Headless WordPress provider. Reads the public REST API only —
 * no credentials involved.
 * The public canonical domain always stays https://wildwestwags.ca.
 */
const PER_PAGE = 12;

export async function wpFetch(path: string): Promise<Response> {
  const response = await fetch(`${WORDPRESS_API_BASE}${path}`);
  if (response.status === 404) return fetch(`${WORDPRESS_PUBLIC_API_BASE}${path}`);
  return response;
}

function publicLink(href: string | undefined) {
  if (!href) return href;
  try {
    const url = new URL(href, "https://wildwestwagsblog.wordpress.com");
    if (url.hostname !== "wildwestwagsblog.wordpress.com") return href;
    const segments = url.pathname.split("/").filter(Boolean);
    const slug = segments.at(-1);
    return slug ? `https://wildwestwags.ca/blog/${slug}${url.hash}` : "https://wildwestwags.ca/blog";
  } catch {
    return href;
  }
}

/** WordPress.com's image CDN avoids direct-upload browser blocking (ORB). */
export function wpImageUrl(src: string): string {
  try {
    const url = new URL(src);
    if (url.hostname === "wildwestwagsblog.wordpress.com" && url.pathname.startsWith("/wp-content/uploads/")) {
      return `https://i0.wp.com/${url.hostname}${url.pathname}${url.search}`;
    }
  } catch {
    // Preserve relative and non-WordPress image sources.
  }
  return src;
}

function decode(s: string) {
  return s
    .replace(/<[^>]*>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&hellip;/g, "…")
    .replace(/&[lr]squo;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function sanitize(html: string) {
  const { default: sanitizeHtml } = await import("sanitize-html");
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "figure", "figcaption", "iframe", "video", "source", "h1", "h2"]),
    allowedAttributes: {
      a: ["href", "title", "target", "rel", "class"],
      img: ["src", "srcset", "sizes", "alt", "width", "height", "loading", "class"],
      iframe: ["src", "title", "allow", "allowfullscreen", "width", "height"],
      video: ["src", "controls", "poster", "width", "height"],
      source: ["src", "type"],
      "*": ["class"],
    },
    allowedIframeHostnames: ["www.youtube.com", "www.youtube-nocookie.com", "player.vimeo.com"],
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, ...(attribs["href"] ? { href: publicLink(attribs["href"]) ?? "" } : {}), rel: "noopener noreferrer" },
      }),
      img: (tagName, attribs) => ({
        tagName,
        attribs: {
          ...attribs,
          ...(attribs["src"] ? { src: wpImageUrl(attribs["src"]) } : {}),
          ...(attribs["srcset"] ? { srcset: attribs["srcset"].split(",").map((candidate) => {
            const [src, ...descriptor] = candidate.trim().split(/\s+/);
            return src ? [wpImageUrl(src), ...descriptor].join(" ") : candidate;
          }).join(", ") } : {}),
          loading: "lazy",
        },
      }),
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapPost(p: any): Promise<BlogPost> {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const url = media?.media_details?.sizes?.large?.source_url ?? media?.source_url;
  const excerptText = decode(p.excerpt?.rendered ?? "");
  return {
    slug: p.slug,
    title: decode(p.title?.rendered ?? ""),
    excerpt: excerptText,
    content: await sanitize(p.content?.rendered ?? ""),
    image: url ? { url: wpImageUrl(url), alt: media?.alt_text || "" } : null,
    author: "Kelsey Creswell",
    authorLine: "Founder of Wild West Wags",
    authorFooter: "Written by Kelsey Creswell, founder of Wild West Wags | Certified Dog Trainer | Positive Reinforcement-Based Dog Walking & Training | North Vancouver, BC",
    metaDescription: typeof p.meta?.advanced_seo_description === "string" && p.meta.advanced_seo_description.trim()
      ? decode(p.meta.advanced_seo_description)
      : excerptText.slice(0, 160),
    date: p.date ?? null,
  };
}

export async function wpListPosts(page: number): Promise<BlogListResult> {
  const res = await wpFetch(`/posts?_embed&per_page=${PER_PAGE}&page=${page}`).catch(() => null);
  if (!res) return { posts: [], totalPages: 0, error: true };
  if (res.status === 400 && page > 1) return { posts: [], totalPages: 1, error: false };
  if (!res.ok) {
    console.error("WP list failed", res.status);
    return { posts: [], totalPages: 0, error: true };
  }
  const json = (await res.json()) as unknown[];
  return {
    posts: await Promise.all(json.map(mapPost)),
    totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
    error: false,
  };
}

export async function wpGetPost(slug: string): Promise<BlogPostResult> {
  const res = await wpFetch(`/posts?slug=${encodeURIComponent(slug)}&_embed`).catch(() => null);
  if (!res) return { post: null, error: true };
  if (!res.ok) {
    console.error("WP post failed", res.status);
    return { post: null, error: true };
  }
  const json = (await res.json()) as unknown[];
  if (!json[0]) return { post: null, error: false };
  return { post: await mapPost(json[0]), error: false };
}
