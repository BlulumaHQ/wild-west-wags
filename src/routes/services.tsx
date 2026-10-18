import { createFileRoute, Link } from "@tanstack/react-router";
import main from "@/assets/kt-41.webp.asset.json";
import detail from "@/assets/kt-36.webp.asset.json";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead({
      title: "Dog Training Services | Wild West Wags North Vancouver",
      description:
        "One-on-one dog training in North Vancouver built around you, your dog and your everyday routine. Contact Wild West Wags for current pricing and availability.",
      path: "/services",
    }),
  component: Services,
});

const GOALS = [
  "Everyday skills and manners",
  "Focus and engagement",
  "Walking and leash skills",
  "Recall and communication",
  "Building confidence",
  "Practical owner guidance",
];

function Services() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-16 lg:px-10 lg:pt-24">
        <div className="fade-up max-w-3xl">
          <p className="eyebrow text-primary">Services + Pricing</p>
          <h1 className="mt-5 text-[2.6rem] text-primary lg:text-6xl">Training built around you and your dog.</h1>
          <p className="mt-6 max-w-[42rem] text-lg">
            Every dog, household and training goal is different. Wild West Wags provides personalized dog-training
            support based on the skills you want to build and the situations that matter most in your everyday life.
          </p>
        </div>
        <img src={main.url} alt="Kelsey working with Trigger during an outdoor training session" className="mt-14 aspect-[16/10] w-full rounded object-cover lg:aspect-[21/9]" />
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-12 lg:px-10 lg:py-28">
        <h2 className="text-4xl text-primary lg:col-span-5 lg:text-5xl">One-on-One Dog Training</h2>
        <div className="max-w-[42rem] space-y-4 lg:col-span-7">
          <p>Personalized training gives you focused support for your dog, your goals and your day-to-day routine.</p>
          <p>
            Sessions are designed to help create clearer communication between you and your dog while building practical
            skills that can carry into everyday life.
          </p>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-28">
          <div className="lg:col-span-7">
            <h2 className="text-4xl text-primary lg:text-5xl">What would you like to work on?</h2>
            <p className="mt-6 max-w-[40rem]">
              Get in touch to discuss your dog, your current challenges and the goals you would like to work toward. Wild
              West Wags can help determine an appropriate starting point and training plan.
            </p>
            <ul className="mt-10 grid border-t border-foreground/15 sm:grid-cols-2 sm:gap-x-10">
              {GOALS.map((g, i) => (
                <li key={g} className="flex items-baseline gap-4 border-b border-foreground/15 py-4">
                  <span className="font-display text-sm text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <img src={detail.url} alt="Close-up of Trigger looking up attentively" loading="lazy" className="aspect-[3/4] w-full max-w-md justify-self-center rounded object-cover lg:col-span-5" />
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center lg:py-28">
        <h2 className="text-4xl text-primary lg:text-5xl">Pricing & Availability</h2>
        <p className="mt-6 font-display text-2xl">Contact for current pricing and availability.</p>
        <p className="mx-auto mt-5 max-w-[40rem] text-muted-foreground">
          Training needs can vary from dog to dog. Send Wild West Wags a little information about your dog and what you
          would like help with, and we can discuss the most appropriate next step.
        </p>
        <Link to="/contact" className="btn-primary mt-9">Ask About Training</Link>
      </section>
    </>
  );
}
