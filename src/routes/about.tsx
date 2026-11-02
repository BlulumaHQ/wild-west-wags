import { createFileRoute } from "@tanstack/react-router";
import main from "@/assets/kt-30.webp.asset.json";
import support from "@/assets/kt-22.webp.asset.json";
import { CredentialLogos } from "@/components/credentials";
import { pageHead } from "@/lib/site";
import { CtaBand } from "@/components/site-chrome";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Kelsey | Wild West Wags North Vancouver",
      description:
        "Meet Kelsey Creswell, founder of Wild West Wags — positive reinforcement dog walking and training in North Vancouver focused on practical skills for everyday life.",
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
          <h1 className="mt-5 text-[2.6rem] lg:text-6xl">Meet Kelsey</h1>
          <div className="mt-6 max-w-[36rem] space-y-5 text-muted-foreground">
            <p>
              Kelsey Creswell is the founder of Wild West Wags, a North Vancouver dog walking and training business
              focused on positive reinforcement, individualized care, and practical skills for everyday life.
            </p>
            <p>
              Her approach combines thoughtful dog walking with skill-building and training, helping dogs develop
              stronger engagement, leash skills, confidence, recall foundations, and calmer responses to everyday
              environments.
            </p>
            <p>
              Kelsey believes good training should be realistic, approachable, and relevant to the life each dog
              actually lives. Her goal is to help dogs and their people build clearer communication, practical skills,
              and more enjoyable experiences together.
            </p>
            <p className="text-foreground">
              Kelsey is a Good Dog Academy Professional Dog Trainer graduate and DOGSAFE Canine First Aid certified.
            </p>
          </div>
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

      <section className="border-t">
        <div className="mx-auto max-w-[1320px] px-5 py-24 lg:px-10 lg:py-32">
          <div className="max-w-2xl">
            <p className="eyebrow text-primary">Credentials &amp; Professional Standards</p>
            <h2 className="mt-5 text-3xl lg:text-4xl">Trained, certified and insured.</h2>
          </div>
          <CredentialLogos className="mt-14" />
        </div>
      </section>

      <CtaBand heading="Ready to get started?" label="Contact Wild West Wags" />
    </>
  );
}
