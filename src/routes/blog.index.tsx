import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { z } from "zod";
import { listPosts, type PostSummary } from "@/lib/wp.functions";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/blog/")({
  validateSearch: z.object({ page: z.number().int().min(1).optional() }),
  loaderDeps: ({ search }) => ({ page: search.page ?? 1 }),
  loader: ({ deps }) => listPosts({ data: { page: deps.page } }),
  head: () =>
    pageHead({
      title: "Dog Training Blog | Wild West Wags",
      description: "Practical training ideas, everyday dog-life insights and updates from Wild West Wags in North Vancouver.",
      path: "/blog",
    }),
  pendingComponent: BlogSkeleton,
  component: Blog,
});

export const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" });

function Header() {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow text-primary">From Wild West Wags</p>
      <h1 className="mt-5 text-[2.6rem] text-primary lg:text-6xl">The Wild West Wags Blog</h1>
      <p className="mt-6 text-lg">Practical training ideas, everyday dog-life insights and updates from Wild West Wags.</p>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24" aria-busy="true">
      <Header />
      <p className="sr-only">Loading Blog…</p>
      <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[4/3] rounded bg-secondary" />
            <div className="mt-5 h-6 w-3/4 bg-secondary" />
            <div className="mt-3 h-4 w-full bg-secondary" />
          </div>
        ))}
      </div>
    </section>
  );
}

function Card({ p }: { p: PostSummary }) {
  return (
    <article className="group">
      <Link to="/blog/$slug" params={{ slug: p.slug }} className="block overflow-hidden rounded">
        {p.image ? (
          <img src={p.image.url} alt={p.image.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
        ) : (
          <div className="flex aspect-[4/3] items-end bg-primary p-6 text-primary-foreground">
            <span className="font-display text-2xl opacity-80">Wild West Wags</span>
          </div>
        )}
      </Link>
      {p.category && <p className="eyebrow mt-5 text-primary">{p.category}</p>}
      <h2 className="mt-3 text-2xl">
        <Link to="/blog/$slug" params={{ slug: p.slug }} className="hover:text-primary">{p.title}</Link>
      </h2>
      <p className="mt-3 line-clamp-3 text-muted-foreground">{p.excerptText}</p>
      <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
        <time dateTime={p.date} className="text-muted-foreground">{fmtDate(p.date)}</time>
        <Link to="/blog/$slug" params={{ slug: p.slug }} className="font-semibold text-primary">Read Article →</Link>
      </div>
    </article>
  );
}

function Blog() {
  const { posts, totalPages, error } = Route.useLoaderData();
  const { page = 1 } = Route.useSearch();
  const router = useRouter();
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 lg:px-10 lg:py-24">
      <Header />
      {error ? (
        <div className="mt-14 border-t pt-10">
          <p>We’re having trouble loading the Blog right now. Please try again shortly.</p>
          <button className="btn-primary mt-6" onClick={() => router.invalidate()}>Try Again</button>
        </div>
      ) : posts.length === 0 ? (
        <p className="mt-14 border-t pt-10 font-display text-2xl">No posts yet — check back soon for updates from Wild West Wags.</p>
      ) : (
        <>
          <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => <Card key={p.slug} p={p} />)}
          </div>
          {totalPages > 1 && (
            <nav aria-label="Blog pages" className="mt-16 flex items-center justify-between border-t pt-6">
              {page > 1 ? <Link to="/blog" search={{ page: page - 1 }} className="font-semibold text-primary">← Newer</Link> : <span />}
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              {page < totalPages ? <Link to="/blog" search={{ page: page + 1 }} className="font-semibold text-primary">Older →</Link> : <span />}
            </nav>
          )}
        </>
      )}
    </section>
  );
}
