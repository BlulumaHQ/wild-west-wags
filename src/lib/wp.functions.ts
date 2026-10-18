import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://cms.wildwestwags.ca/wp-json/wp/v2";

export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  excerptText: string;
  date: string;
  category: string | null;
  image: { url: string; alt: string } | null;
};
export type Post = PostSummary & { content: string; modified: string };

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapSummary(p: any): PostSummary {
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const cat = p._embedded?.["wp:term"]?.[0]?.find?.((t: { taxonomy: string; name: string }) => t.taxonomy === "category");
  const url = media?.media_details?.sizes?.large?.source_url ?? media?.source_url;
  return {
    slug: p.slug,
    title: decode(p.title?.rendered ?? ""),
    excerpt: p.excerpt?.rendered ?? "",
    excerptText: decode(p.excerpt?.rendered ?? ""),
    date: p.date,
    category: cat && cat.name !== "Uncategorized" ? decode(cat.name) : null,
    image: url ? { url, alt: media?.alt_text || "" } : null,
  };
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

export const listPosts = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ page: z.number().int().min(1).max(500) }).parse(d))
  .handler(async ({ data }) => {
    const res = await fetch(`${API}/posts?_embed&per_page=9&page=${data.page}`).catch(() => null);
    if (!res) return { posts: [] as PostSummary[], totalPages: 0, error: true };
    if (res.status === 400 && data.page > 1) return { posts: [] as PostSummary[], totalPages: 1, error: false };
    if (!res.ok) {
      console.error("WP list failed", res.status);
      return { posts: [] as PostSummary[], totalPages: 0, error: true };
    }
    const json = await res.json();
    return {
      posts: (json as unknown[]).map(mapSummary),
      totalPages: Number(res.headers.get("X-WP-TotalPages") ?? 1),
      error: false,
    };
  });

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d: unknown) => z.object({ slug: z.string().regex(/^[a-z0-9-%]+$/i).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const res = await fetch(`${API}/posts?slug=${encodeURIComponent(data.slug)}&_embed`).catch(() => null);
    if (!res) return { post: null as Post | null, error: true };
    if (!res.ok) {
      console.error("WP post failed", res.status);
      return { post: null as Post | null, error: true };
    }
    const json = (await res.json()) as unknown[];
    const raw = json[0] as { content?: { rendered?: string }; modified?: string } | undefined;
    if (!raw) return { post: null as Post | null, error: false };
    const post: Post = { ...mapSummary(raw), content: await sanitize(raw.content?.rendered ?? ""), modified: raw.modified ?? "" };
    return { post, error: false };
  });
