import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { getBlogPost } from "@/lib/blog";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const r = await getBlogPost({ data: { slug: params.slug } });
    if (!r.error && !r.post) throw notFound();
    return r;
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const url = `${SITE.url}/blog/${params.slug}`;
    if (!post) return { meta: [{ title: "Article | Wild West Wags" }, { name: "robots", content: "noindex" }] };
    const title = `${post.title} | Wild West Wags`;
    const desc = post.metaDescription || post.excerpt.slice(0, 160);
    const meta = [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "article" },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: desc },
    ];
    if (post.image) meta.push({ property: "og:image", content: post.image.url }, { name: "twitter:image", content: post.image.url });
    return {
      meta,
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: desc,
            ...(post.date ? { datePublished: post.date } : {}),
            author: { "@type": "Person", name: post.author, jobTitle: post.authorLine },
            mainEntityOfPage: url,
            ...(post.image ? { image: post.image.url } : {}),
            publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
          }),
        },
      ],
    };
  },
  pendingComponent: () => (
    <div className="mx-auto max-w-3xl animate-pulse px-5 py-24" aria-busy="true">
      <p className="sr-only">Loading Article…</p>
      <div className="h-12 w-3/4 bg-secondary" />
      <div className="mt-10 aspect-[16/9] bg-secondary" />
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="text-4xl">Article not found</h1>
      <p className="mt-4 text-muted-foreground">This article may have moved or is no longer available.</p>
      <Link to="/blog" className="btn-primary mt-8">Back to Blog</Link>
    </div>
  ),
  component: Article,
});

function Article() {
  const { post } = Route.useLoaderData();
  const router = useRouter();
  if (!post)
    return (
      <div className="mx-auto max-w-xl px-5 py-32 text-center">
        <p>We’re having trouble loading the Blog right now. Please try again shortly.</p>
        <button className="btn-primary mt-6" onClick={() => router.invalidate()}>Try Again</button>
      </div>
    );
  return (
    <>
      <article className="px-5 pb-20 pt-36 lg:pb-28 lg:pt-44">
        <header className="mx-auto max-w-[46rem]">
          <p className="eyebrow text-primary">Wild West Wags Blog</p>
          <h1 className="mt-4 text-[2.4rem] lg:text-5xl">{post.title}</h1>
          <p className="mt-6 text-muted-foreground">
            By <span className="font-semibold text-foreground">{post.author}</span>
            <span aria-hidden className="mx-2">·</span>
            {post.authorLine}
          </p>
        </header>
        {post.image && (
          <img src={post.image.url} alt={post.image.alt} className="mx-auto mt-12 aspect-[16/9] w-full max-w-5xl object-cover" />
        )}
        <div className="prose-wp mx-auto mt-12 max-w-[44rem]" dangerouslySetInnerHTML={{ __html: post.content }} />
        {post.authorFooter && (
          <p className="mx-auto mt-14 max-w-[44rem] border-t pt-6 text-sm text-muted-foreground">{post.authorFooter}</p>
        )}
        <div className="mx-auto mt-10 max-w-[44rem] border-t pt-6">
          <Link to="/blog" className="font-semibold text-primary">← Back to Blog</Link>
        </div>
      </article>

      <section className="bg-warm">
        <div className="mx-auto max-w-[1320px] px-5 py-24 text-center lg:px-10 lg:py-32">
          <span className="rule-line mx-auto text-primary" />
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl lg:text-5xl">Looking for support with your dog?</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Tell us a little about your dog and what you'd like to work on.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <Link to="/services" className="btn-primary">Explore Services</Link>
            <Link to="/contact" className="btn-outline-dark">Get in Touch</Link>
          </div>
        </div>
      </section>
    </>
  );
}
