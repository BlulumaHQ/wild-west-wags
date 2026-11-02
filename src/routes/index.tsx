import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slide1 from "@/assets/kt-41b.webp.asset.json";
import slide2 from "@/assets/kt-18.webp.asset.json";
import slide3 from "@/assets/kt-22b.webp.asset.json";
import { CredentialLogos } from "@/components/credentials";
import { pageHead, SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Wild West Wags | Dog Walking & Dog Training in North Vancouver, BC",
      description:
        "Wild West Wags provides personalized dog walking and dog training in North Vancouver, BC, focused on practical everyday skills, clearer communication and better life with your dog.",
      path: "/",
    }),
  component: Index,
});

const SLIDES = [
  {
    src: slide1.url,
    alt: "Kelsey with her dog Trigger outdoors in North Vancouver",
    pos: "object-[32%_8%] lg:object-[32%_18%]",
    fx: "lg:-ml-[3%] lg:w-[106%] lg:scale-[1.35] lg:origin-bottom-left lg:translate-x-[2.8%]",
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
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-[1400ms] ease-out ${s.pos} ${"fx" in s ? s.fx : ""} ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-overlay" aria-hidden />
      <div className="mx-auto w-full max-w-[1320px] px-5 pb-24 pt-40 text-primary-foreground lg:px-10 lg:pb-28">
        <div className="fade-up max-w-2xl">
          <p className="eyebrow">Dog Walking &amp; Dog Training · North Vancouver</p>
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
            <Link to="/services" className="btn-primary">Explore Services</Link>
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

function Index() {
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
            Wild West Wags offers personalized dog walks and leash skills development in North Vancouver, with a
            practical focus on building confidence, improving communication, and creating more enjoyable everyday
            experiences for dogs and their people. From loose leash walking and managing distractions to building
            engagement, recall, and reliable everyday skills, our approach is designed to support you and your dog in
            real-world environments.
          </p>
          <p>
            Training should feel useful, approachable, and relevant to everyday life — helping you understand your
            dog, build lasting skills, and feel more confident navigating the world together.
          </p>
          <Link to="/about" className="text-link pt-2">Learn About Wild West Wags →</Link>
        </div>
      </section>

      {/* Professional credentials */}
      <section className="border-y">
        <div className="mx-auto max-w-[1320px] px-5 py-20 lg:px-10 lg:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">Professional Credentials &amp; Standards</p>
            <h2 className="mt-5 text-3xl lg:text-4xl">Professional care you can feel confident in.</h2>
            <p className="mt-5 text-muted-foreground">
              Wild West Wags combines professional training, safety awareness, individualized care, and responsible
              business practices to provide thoughtful support for dogs and their people.
            </p>
          </div>
          <CredentialLogos className="mt-14" />
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-b bg-secondary">
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
