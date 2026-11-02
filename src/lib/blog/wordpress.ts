import type { BlogListResult, BlogPost, BlogPostResult } from "./types";

/**
 * Headless WordPress provider. Inactive until USE_WORDPRESS_BLOG is flipped
 * in ./index.ts. Reads the public REST API only — no credentials involved.
 * The public canonical domain always stays https://wildwestwags.ca.
 */
const API = "https://cms.wildwestwags.ca/wp-json/wp/v2";
const PER_PAGE = 12;

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
      a: sanitizeHtml.simpleTransform("a", { rel: "noopener noreferrer" }),
      img: sanitizeHtml.simpleTransform("img", { loading: "lazy" }),
    },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function mapPost(p: any): Promise<BlogPost> {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const author = p._embedded?.author?.[0];
  const url = media?.media_details?.sizes?.large?.source_url ?? media?.source_url;
  const excerptText = decode(p.excerpt?.rendered ?? "");
  return {
    slug: p.slug,
    title: decode(p.title?.rendered ?? ""),
    excerpt: excerptText,
    content: await sanitize(p.content?.rendered ?? ""),
    image: url ? { url, alt: media?.alt_text || "" } : null,
    author: author?.name ? decode(author.name) : "Kelsey Creswell",
    authorLine: "Founder of Wild West Wags",
    authorFooter: "",
    metaDescription: excerptText.slice(0, 160),
    date: p.date ?? null,
  };
}

export async function wpListPosts(page: number): Promise<BlogListResult> {
  const res = await fetch(`${API}/posts?_embed&per_page=${PER_PAGE}&page=${page}`).catch(() => null);
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
  const res = await fetch(`${API}/posts?slug=${encodeURIComponent(slug)}&_embed`).catch(() => null);
  if (!res) return { post: null, error: true };
  if (!res.ok) {
    console.error("WP post failed", res.status);
    return { post: null, error: true };
  }
  const json = (await res.json()) as unknown[];
  if (!json[0]) return { post: null, error: false };
  return { post: await mapPost(json[0]), error: false };
}
