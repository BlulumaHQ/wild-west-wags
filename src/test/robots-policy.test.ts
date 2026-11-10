import { describe, it, expect } from "vitest";
import { applyRobotsPolicy, isPlatformHost } from "@/lib/robots-policy";

const html = () => new Response("<html></html>", { headers: { "content-type": "text/html; charset=utf-8" } });

describe("robots policy", () => {
  for (const u of [
    "https://wild-west-wags.lovable.app/blog/x",
    "https://id-preview--abc.lovable.app/",
    "https://app.foo.workers.dev/about",
    "https://x.pages.dev/",
    "https://x.netlify.app/",
  ])
    it(`noindexes ${u}`, () => expect(applyRobotsPolicy(new Request(u), html()).headers.get("x-robots-tag")).toBe("noindex"));

  it("keeps the custom domain indexable", () => {
    expect(applyRobotsPolicy(new Request("https://wildwestwags.ca/blog"), html()).headers.get("x-robots-tag")).toBeNull();
    expect(isPlatformHost("www.wildwestwags.ca")).toBe(false);
    expect(isPlatformHost("evil-lovable.app.example.com")).toBe(false);
  });

  it("leaves non-HTML untouched", () => {
    const r = new Response("<urlset/>", { headers: { "content-type": "application/xml" } });
    expect(applyRobotsPolicy(new Request("https://x.lovable.app/sitemap.xml"), r).headers.get("x-robots-tag")).toBeNull();
  });
});
