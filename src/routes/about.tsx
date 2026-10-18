import { createFileRoute } from "@tanstack/react-router";
import main from "@/assets/kt-30.webp.asset.json";
import support from "@/assets/kt-22.webp.asset.json";
import trail from "@/assets/kt-36.webp.asset.json";
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
      <section className="mx-auto grid max-w-[1320px] gap-12 px-5 pb-20 pt-36 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pb-28 lg:pt-44">
        <div className="fade-up lg:col-span-5 lg:pt-8">
          <p className="eyebrow text-primary">About</p>
          <h1 className="mt-5 text-[2.6rem] lg:text-6xl">A practical approach to a better life together.</h1>
          <p className="mt-6 max-w-[36rem] text-muted-foreground">
            Wild West Wags is based in North Vancouver, where dogs are part of everyday life — from neighbourhood walks
            and busy community spaces to weekends spent exploring the trails.
          </p>
          <p className="mt-4 max-w-[36rem] text-muted-foreground">
            The goal of training is not simply to perform behaviours during a lesson. It is to build communication and
            skills that make everyday life with your dog easier, clearer and more enjoyable.
          </p>
        </div>
        <div className="lg:col-span-7">
          <img src={main.url} alt="Kelsey kneeling beside Trigger outdoors" className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-36">
          <div className="max-w-xl">
            <span className="rule-line text-primary" />
            <h2 className="mt-6 text-4xl lg:text-5xl">Every dog is an individual.</h2>
            <div className="mt-6 space-y-5">
              <p>There is no single training plan that makes sense for every dog or every household.</p>
              <p>
                Dogs learn within the context of their environment, experiences and relationship with their owners.
                That is why Wild West Wags takes a personalized approach, focusing on the areas that matter most to
                each dog-and-owner team.
              </p>
              <p>
                Training should leave owners with a clearer understanding of their dog and practical tools they feel
                comfortable using in real life.
              </p>
            </div>
          </div>
          <img src={support.url} alt="Trigger walking on a loose leash beside Kelsey" loading="lazy" className="aspect-[4/3] w-full object-cover" />
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-36">
          <img src={trail.url} alt="Trigger looking up attentively during training" loading="lazy" className="aspect-[4/3] w-full object-cover lg:order-first" />
          <div className="max-w-xl lg:order-last">
            <span className="rule-line text-primary" />
            <h2 className="mt-6 text-4xl lg:text-5xl">Training that goes beyond the session.</h2>
            <div className="mt-6 space-y-5">
              <p>Progress is built through consistency, communication and practice in everyday situations.</p>
              <p>
                The aim is to help you understand not only what to do, but why you are doing it — so the skills
                developed through training can continue becoming part of daily life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CtaBand heading="Ready to get started?" label="Contact Wild West Wags" />
    </>
  );
}
