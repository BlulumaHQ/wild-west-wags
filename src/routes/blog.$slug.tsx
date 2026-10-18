import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { getPost } from "@/lib/wp.functions";
import { SITE } from "@/lib/site";
import { CtaBand } from "@/components/site-chrome";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const r = await getPost({ data: { slug: params.slug } });
    if (!r.error && !r.post) throw notFound();
    return r;
  },
  head: ({ loaderData, params }) => {
    const post = loaderData?.post;
    const url = `${SITE.url}/blog/${params.slug}`;
    if (!post) return { meta: [{ title: "Article | Wild West Wags" }, { name: "robots", content: "noindex" }] };
    const title = `${post.title} | Wild West Wags`;
    const desc = post.excerptText.slice(0, 160);
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
            datePublished: post.date,
            dateModified: post.modified || post.date,
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
        <header className="mx-auto max-w-[47rem]">
          {post.category && <p className="eyebrow text-primary">{post.category}</p>}
          <h1 className="mt-4 text-[2.4rem] lg:text-6xl">{post.title}</h1>
          <time dateTime={post.date} className="mt-6 block text-muted-foreground">{fmtDate(post.date)}</time>
        </header>
        {post.image && (
          <img src={post.image.url} alt={post.image.alt} className="mx-auto mt-12 aspect-[16/9] w-full max-w-5xl object-cover" />
        )}
        <div className="prose-wp mx-auto mt-12 max-w-[44rem]" dangerouslySetInnerHTML={{ __html: post.content }} />
        <div className="mx-auto mt-16 max-w-[44rem] border-t pt-6">
          <Link to="/blog" className="font-semibold text-primary">← Back to Blog</Link>
        </div>
      </article>
      <CtaBand
        heading="Looking for training support?"
        body="Tell us a little about your dog and what you would like to work on."
        label="Get in Touch"
      />
    </>
  );
}
