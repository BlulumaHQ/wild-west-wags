import { createFileRoute } from "@tanstack/react-router";
import main from "@/assets/kt-30.webp.asset.json";
import support from "@/assets/kt-22.webp.asset.json";
import { pageHead } from "@/lib/site";
import { CtaBand } from "@/components/site-chrome";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Wild West Wags | North Vancouver Dog Training",
      description:
        "Wild West Wags is a North Vancouver dog-training business focused on clear communication, practical skills and helping dogs and their people feel confident together.",
      path: "/about",
    }),
  component: About,
});

function About() {
  return (
    <>
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-24">
        <div className="fade-up lg:col-span-5 lg:pt-10">
          <p className="eyebrow text-primary">About Wild West Wags</p>
          <h1 className="mt-5 text-[2.6rem] text-primary lg:text-6xl">A better relationship starts with better communication.</h1>
        </div>
        <div className="lg:col-span-7">
          <img src={main.url} alt="Kelsey kneeling beside Trigger outdoors" className="aspect-[4/3] w-full rounded object-cover" />
        </div>
      </section>

      <section className="mx-auto max-w-[44rem] space-y-6 px-5 pb-20">
        <p className="font-display text-2xl leading-snug">
          Wild West Wags is a North Vancouver dog-training business focused on helping dogs and their people feel more
          confident together.
        </p>
        <p>
          Training should make everyday life easier, not more complicated. The focus is on clear communication, practical
          skills and helping owners build a stronger understanding of their dogs.
        </p>
        <p>
          Every dog and every household is different. That is why training should work with the life you actually share
          with your dog — at home, around the neighbourhood and out enjoying everything the North Shore has to offer.
        </p>
        <p>The goal is simple: create stronger everyday skills, clearer communication and more enjoyable time together.</p>
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <img src={support.url} alt="Trigger walking on a loose leash beside Kelsey" loading="lazy" className="aspect-[4/3] w-full rounded object-cover" />
          <div className="max-w-xl">
            <span className="rule-line text-primary" />
            <h2 className="mt-6 text-4xl text-primary lg:text-5xl">Training that fits real life.</h2>
            <p className="mt-6">
              Good training is not just about what happens during a session. It is about creating skills that make sense
              in everyday situations and helping owners feel confident carrying those skills forward.
            </p>
            <p className="mt-4">
              Wild West Wags takes a personal, practical approach so training can become part of everyday life rather
              than something that only works in a controlled environment.
            </p>
          </div>
        </div>
      </section>

      <CtaBand heading="Ready to get started?" label="Contact Wild West Wags" />
    </>
  );
}
