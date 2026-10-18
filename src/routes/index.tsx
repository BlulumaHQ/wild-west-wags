import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "@/assets/kt-41b.webp.asset.json";
import slide2 from "@/assets/kt-18.webp.asset.json";
import slide3 from "@/assets/kt-22b.webp.asset.json";
import philosophy from "@/assets/kt-15.webp.asset.json";
import portrait from "@/assets/kt-30.webp.asset.json";
import photoBreak from "@/assets/kt-8.webp.asset.json";
import { listPosts, type PostSummary } from "@/lib/wp.functions";
import { pageHead, SITE } from "@/lib/site";
import { fmtDate } from "./blog.index";

export const Route = createFileRoute("/")({
  loader: () => listPosts({ data: { page: 1 } }).catch(() => ({ posts: [] as PostSummary[], totalPages: 0, error: true })),
  head: () =>
    pageHead({
      title: "Wild West Wags | Dog Training in North Vancouver, BC",
      description:
        "Wild West Wags provides personalized dog training in North Vancouver, BC, focused on practical everyday skills, clearer communication and better life with your dog.",
      path: "/",
    }),
  component: Index,
});

const SLIDES = [
  {
    src: slide1.url,
    alt: "Kelsey with her dog Trigger outdoors in North Vancouver",
    pos: "object-[32%_8%]",
    fx: "lg:scale-[1.35] lg:origin-bottom-left lg:translate-x-[3%]",
  },
  { src: slide2.url, alt: "Kelsey and Trigger together on a walk", pos: "object-[50%_40%] lg:object-[50%_58%]" },
  { src: slide3.url, alt: "Kelsey training with Trigger on a North Shore trail", pos: "object-[50%_45%] lg:object-[50%_62%]" },
] as const;

function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const go = useCallback((n: number) => setIndex((i) => (i + n + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    if (paused || reduced.current) return;
    const t = setInterval(() => go(1), 6000);
    return () => clearInterval(t);
  }, [paused, go]);

  return (
    <section
      className="relative isolate flex min-h-[88svh] items-end overflow-hidden bg-foreground lg:min-h-[94svh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const endX = e.changedTouches[0]?.clientX;
        if (touchX.current == null || endX == null) return;
        const dx = endX - touchX.current;
        if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
        touchX.current = null;
        setPaused(true);
      }}
      aria-roledescription="carousel"
      aria-label="Wild West Wags photography"
    >
      {SLIDES.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={i === index ? s.alt : ""}
          aria-hidden={i !== index}
          fetchPriority={i === 0 ? "high" : undefined}
          loading={i === 0 ? undefined : "lazy"}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${s.pos} ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-overlay" aria-hidden />
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-24 pt-40 text-primary-foreground lg:px-10 lg:pb-28">
        <div className="fade-up max-w-2xl">
          <p className="eyebrow">Dog Training · North Vancouver</p>
          <h1 className="mt-6 text-[2.6rem] font-semibold sm:text-6xl lg:text-[4.25rem]">
            Better communication.
            <br />
            Better adventures together.
          </h1>
          <p className="mt-6 max-w-xl text-lg opacity-95">
            Practical, personalized dog training designed to build confidence, strengthen everyday skills, and help you
            enjoy more of life with your dog.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/services" className="btn-primary">Explore Training</Link>
            <Link to="/contact" className="btn-outline-light">Get in Touch</Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 right-5 flex items-center gap-3 text-white lg:right-10">
        <div className="flex gap-2" role="tablist" aria-label="Slides">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === index}
              aria-label={`Slide ${i + 1}`}
              onClick={() => { setIndex(i); setPaused(true); }}
              className={`h-1 rounded-full transition-all duration-500 ${i === index ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`}
            />
          ))}
        </div>
        <button aria-label="Previous slide" onClick={() => { go(-1); setPaused(true); }} className="flex h-10 w-10 items-center justify-center opacity-70 transition hover:opacity-100">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button aria-label="Next slide" onClick={() => { go(1); setPaused(true); }} className="flex h-10 w-10 items-center justify-center opacity-70 transition hover:opacity-100">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}

const PRINCIPLES = [
  { n: "01", title: "Clear Communication", body: "Training should help both you and your dog better understand what is expected." },
  { n: "02", title: "Practical Skills", body: "Focus on useful behaviours that translate into everyday life, not just the training session." },
  { n: "03", title: "Stronger Connection", body: "Build skills while strengthening the relationship between dog and owner." },
];

const AREAS = [
  { title: "Everyday Manners", body: "Build practical behaviours that make life at home and out in the world easier to manage." },
  { title: "Leash Skills", body: "Work toward calmer, more connected walks with clearer communication between you and your dog." },
  { title: "Focus & Engagement", body: "Help your dog develop stronger attention and the ability to stay connected with you around everyday distractions." },
  { title: "Recall", body: "Develop clearer communication and stronger response when calling your dog back." },
  { title: "Confidence Building", body: "Support dogs as they learn to navigate new environments and everyday situations with greater confidence." },
  { title: "Owner Guidance", body: "Learn practical ways to continue reinforcing skills and creating consistency outside of training sessions." },
];

function LatestBlog({ posts, error }: { posts: PostSummary[]; error: boolean }) {
  return (
    <section className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10 lg:py-32">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-xl">
          <p className="eyebrow text-primary">From the Blog</p>
          <h2 className="mt-5 text-4xl lg:text-5xl">Training notes, ideas & everyday dog life.</h2>
          <p className="mt-5 text-muted-foreground">
            Practical thoughts on training, communication, confidence, and enjoying more of everyday life with your dog.
          </p>
        </div>
        <Link to="/blog" className="btn-outline-dark">View All Articles</Link>
      </div>
      {error || posts.length === 0 ? (
        <p className="mt-14 border-t pt-10 text-muted-foreground">
          New articles are on their way — check back soon for training notes from Wild West Wags.
        </p>
      ) : (
        <div className="mt-14 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((p) => (
            <article key={p.slug} className="group">
              <Link to="/blog/$slug" params={{ slug: p.slug }} className="block overflow-hidden">
                {p.image ? (
                  <img src={p.image.url} alt={p.image.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
                ) : (
                  <div className="flex aspect-[4/3] items-end bg-secondary p-6">
                    <span className="font-display text-xl font-semibold text-primary">Wild West Wags</span>
                  </div>
                )}
              </Link>
              {p.category && <p className="eyebrow mt-5 text-primary">{p.category}</p>}
              <h3 className="mt-3 text-2xl">
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="transition hover:text-primary">{p.title}</Link>
              </h3>
              <p className="mt-3 line-clamp-3 text-muted-foreground">{p.excerptText}</p>
              <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
                <time dateTime={p.date} className="text-muted-foreground">{fmtDate(p.date)}</time>
                <Link to="/blog/$slug" params={{ slug: p.slug }} className="font-semibold text-primary">Read Article →</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function Index() {
  const { posts, error } = Route.useLoaderData();
  return (
    <>
      <HeroSlider />

      {/* Introduction */}
      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-24 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-36">
        <div className="lg:col-span-5">
          <p className="eyebrow text-primary">Welcome to Wild West Wags</p>
          <h2 className="mt-5 text-4xl lg:text-5xl">Training for the life you actually share with your dog.</h2>
        </div>
        <div className="max-w-[42rem] space-y-5 lg:col-span-7 lg:pt-12">
          <p>
            Life with your dog happens far beyond a training session. It happens on neighbourhood walks, busy
            sidewalks, forest trails, quiet mornings at home, and everywhere in between.
          </p>
          <p>
            Wild West Wags offers personalized dog training in North Vancouver with a practical focus on clearer
            communication, stronger everyday skills, and helping both dogs and their people feel more confident
            together.
          </p>
          <p>
            Training should feel useful, understandable, and relevant to real life — giving you tools you can continue
            using long after the session is over.
          </p>
          <Link to="/about" className="text-link pt-2">Learn About Wild West Wags →</Link>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:py-36">
          <img
            src={philosophy.url}
            alt="Kelsey working with Trigger during a training session"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover lg:col-span-5"
          />
          <div className="lg:col-span-7">
            <span className="rule-line text-primary" />
            <h2 className="mt-6 text-4xl lg:text-5xl">Real-world skills. Clearer communication.</h2>
            <div className="mt-6 max-w-[40rem] space-y-5">
              <p>
                Every dog comes with a different personality, history, lifestyle and set of needs. Effective training
                starts by understanding the dog in front of you rather than forcing every dog into the same formula.
              </p>
              <p>
                Wild West Wags focuses on practical skills that can support everyday life — helping owners communicate
                more clearly, create consistency, and build a relationship that feels easier to navigate.
              </p>
              <p>
                Whether your goal is a calmer walk, stronger engagement, improved everyday manners or simply a better
                understanding of your dog, training begins with creating a clear path forward together.
              </p>
            </div>
            <ul className="mt-12 border-t">
              {PRINCIPLES.map((p) => (
                <li key={p.n} className="grid gap-2 border-b py-6 sm:grid-cols-[3rem_12rem_1fr] sm:items-baseline sm:gap-6">
                  <span className="text-sm font-semibold text-primary">{p.n}</span>
                  <span className="eyebrow">{p.title}</span>
                  <span className="text-muted-foreground">{p.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Training areas */}
      <section className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10 lg:py-36">
        <div className="max-w-2xl">
          <p className="eyebrow text-primary">How We Can Help</p>
          <h2 className="mt-5 text-4xl lg:text-5xl">Build skills that make everyday life better.</h2>
          <p className="mt-5 text-muted-foreground">
            Training goals look different for every dog. Wild West Wags provides personalized support based on your
            dog, your lifestyle, and the areas you would most like to improve.
          </p>
        </div>
        <ul className="mt-14 grid border-t sm:grid-cols-2 lg:grid-cols-3">
          {AREAS.map((a, i) => (
            <li key={a.title} className="border-b py-8 sm:px-8 sm:first:pl-0 sm:[&:nth-child(2n)]:pr-0 lg:[&:nth-child(2n)]:px-8 lg:[&:nth-child(3n+1)]:pl-0 lg:[&:nth-child(3n)]:pr-0">
              <span className="text-sm font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 font-display text-xl font-semibold">{a.title}</h3>
              <p className="mt-2 text-[0.95rem] text-muted-foreground">{a.body}</p>
            </li>
          ))}
        </ul>
        <Link to="/services" className="btn-outline-dark mt-12">View Services + Pricing</Link>
      </section>

      {/* About preview */}
      <section className="bg-warm">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 lg:grid-cols-12 lg:gap-20 lg:px-10 lg:py-36">
          <div className="lg:col-span-6">
            <p className="eyebrow text-primary">Meet Wild West Wags</p>
            <h2 className="mt-5 text-4xl lg:text-5xl">Helping dogs and their people understand each other better.</h2>
            <div className="mt-6 max-w-[38rem] space-y-5">
              <p>
                Wild West Wags is a North Vancouver dog-training business built around a simple idea: training should
                make life together feel better.
              </p>
              <p>
                Rather than treating training as something that only happens during a lesson, the focus is on building
                practical communication and skills that can become part of everyday life.
              </p>
              <p>
                From neighbourhood walks to North Shore trails, the goal is to help owners feel more confident working
                with their dogs wherever life takes them.
              </p>
            </div>
            <Link to="/about" className="text-link mt-8">Our Story →</Link>
          </div>
          <img
            src={portrait.url}
            alt="Kelsey kneeling beside Trigger outdoors"
            loading="lazy"
            className="aspect-[4/5] w-full object-cover lg:col-span-6"
          />
        </div>
      </section>

      {/* Photographic break */}
      <section className="relative isolate flex min-h-[60svh] items-end overflow-hidden lg:min-h-[75svh]">
        <img
          src={photoBreak.url}
          alt="Kelsey walking with Trigger on a forest trail in North Vancouver"
          loading="lazy"
          className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 -z-10 bg-overlay" aria-hidden />
        <p className="mx-auto w-full max-w-[1320px] px-5 pb-16 font-display text-3xl font-semibold text-primary-foreground lg:px-10 lg:pb-20 lg:text-5xl">
          Built for life beyond the training session.
        </p>
      </section>

      <LatestBlog posts={posts} error={error} />

      {/* Final CTA */}
      <section className="border-t bg-secondary">
        <div className="mx-auto max-w-[1320px] px-5 py-24 text-center lg:px-10 lg:py-32">
          <span className="rule-line mx-auto text-primary" />
          <h2 className="mx-auto mt-6 max-w-2xl text-4xl lg:text-5xl">Ready to take the next step with your dog?</h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Tell us a little about your dog, what you would like to work on, and the kind of support you are looking
            for.
          </p>
          <Link to="/contact" className="btn-primary mt-9">Start a Conversation</Link>
          <p className="mt-8 text-sm text-muted-foreground">
            <a href={SITE.tel} className="transition hover:text-primary">{SITE.phone}</a>
            <span aria-hidden className="mx-3">·</span>
            <a href={`mailto:${SITE.email}`} className="transition hover:text-primary">{SITE.email}</a>
          </p>
        </div>
      </section>
    </>
  );
}
