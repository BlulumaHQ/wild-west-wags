import { afterEach, describe, expect, it, vi } from "vitest";
import { USE_WORDPRESS_BLOG, WORDPRESS_API_BASE, WORDPRESS_PUBLIC_API_BASE } from "@/lib/blog/config";
import { wpGetPost, wpListPosts, wpImageUrl } from "@/lib/blog/wordpress";

const slug = "benefits-of-skill-building-walks";
function post(meta: Record<string, unknown> = {}) {
  return {
    slug, title: { rendered: "Skill &amp; focus" },
    excerpt: { rendered: `<p>${"x".repeat(180)}</p>` },
    content: { rendered: '<p>Real content</p><script>alert(1)</script><img src="https://example.com/dog.webp" onerror="alert(1)"><a href="https://wildwestwagsblog.wordpress.com/2026/11/09/benefits-of-skill-building-walks/">Article</a>' },
    meta, date: "2026-11-09T10:00:00",
    _embedded: { author: [{ name: "WordPress account" }], "wp:featuredmedia": [{ source_url: "https://example.com/dog.webp", alt_text: "Trigger training" }] },
  };
}
function mockPost(meta: Record<string, unknown> = {}) {
  return vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify([post(meta)]), { headers: { "X-WP-TotalPages": "1" } })));
}
afterEach(() => vi.unstubAllGlobals());

describe("Live WordPress blog rules", () => {
  it("serves the same WordPress upload through its browser-safe image CDN", () => {
    expect(wpImageUrl("https://wildwestwagsblog.wordpress.com/wp-content/uploads/2026/11/kt-8.webp?w=1024")).toBe("https://i0.wp.com/wildwestwagsblog.wordpress.com/wp-content/uploads/2026/11/kt-8.webp?w=1024");
    expect(wpImageUrl("/assets/kt-8.webp")).toBe("/assets/kt-8.webp");
  });
  it("activates the requested public CMS", () => {
    expect(USE_WORDPRESS_BLOG).toBe(true);
    expect(WORDPRESS_API_BASE).toBe("https://wildwestwagsblog.wordpress.com/wp-json/wp/v2");
  });
  it("uses Kelsey attribution regardless of the WordPress author", async () => {
    mockPost();
    const { post: result } = await wpGetPost(slug);
    expect(result?.author).toBe("Kelsey Creswell");
    expect(result?.authorLine).toBe("Founder of Wild West Wags");
    expect(result?.authorFooter).toBe("Written by Kelsey Creswell, founder of Wild West Wags | Certified Dog Trainer | Positive Reinforcement-Based Dog Walking & Training | North Vancouver, BC");
  });
  it("prefers advanced_seo_description without copying CMS noindex", async () => {
    mockPost({ advanced_seo_description: "Public SEO description", jetpack_seo_noindex: true });
    const { post: result } = await wpGetPost(slug);
    expect(result?.metaDescription).toBe("Public SEO description");
    expect(result).not.toHaveProperty("robots");
  });
  it("falls back to a 160-character excerpt for missing or empty SEO meta", async () => {
    for (const meta of [{}, { advanced_seo_description: "   " }]) {
      mockPost(meta);
      expect((await wpGetPost(slug)).post?.metaDescription).toBe("x".repeat(160));
    }
  });
  it("embeds featured media and preserves WordPress alt_text", async () => {
    mockPost();
    const result = await wpListPosts(1);
    expect(fetch).toHaveBeenCalledWith(`${WORDPRESS_API_BASE}/posts?_embed&per_page=12&page=1`);
    expect(result.posts[0]?.image).toEqual({ url: "https://example.com/dog.webp", alt: "Trigger training" });
  });
  it("keeps safe content and blocks scripts and event handlers", async () => {
    mockPost();
    const content = (await wpGetPost(slug)).post?.content;
    expect(content).toContain("Real content");
    expect(content).not.toMatch(/<script|onerror|alert\(/);
  });
  it("rewrites CMS frontend article links to public canonical articles", async () => {
    mockPost();
    const content = (await wpGetPost(slug)).post?.content;
    expect(content).toContain(`href="https://wildwestwags.ca/blog/${slug}"`);
    expect(content).not.toContain('href="https://wildwestwagsblog.wordpress.com');
  });
  it("falls back to WordPress.com's public REST API when wp-json returns 404", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValueOnce(new Response("Not found", { status: 404 })).mockResolvedValueOnce(new Response(JSON.stringify([post()]))));
    expect((await wpGetPost(slug)).post?.slug).toBe(slug);
    expect(fetch).toHaveBeenLastCalledWith(`${WORDPRESS_PUBLIC_API_BASE}/posts?slug=${slug}&_embed`);
  });
});