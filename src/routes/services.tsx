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

const AREAS = [
  "Everyday manners",
  "Leash skills",
  "Recall",
  "Focus and engagement",
  "Confidence building",
  "Owner guidance",
];

function Services() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pt-36 lg:px-10 lg:pt-44">
        <div className="fade-up max-w-3xl">
          <p className="eyebrow text-primary">Services + Pricing</p>
          <h1 className="mt-5 text-[2.6rem] lg:text-6xl">Personalized training for everyday life.</h1>
          <p className="mt-6 max-w-[42rem] text-lg text-muted-foreground">
            Every dog and household has different goals. Wild West Wags provides personalized training support based on
            the areas that matter most to you and your dog.
          </p>
        </div>
        <img src={main.url} alt="Kelsey working with Trigger during an outdoor training session" className="mt-14 aspect-[16/10] w-full object-cover lg:aspect-[21/9]" />
      </section>

      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 py-24 lg:grid-cols-12 lg:px-10 lg:py-32">
        <h2 className="text-4xl lg:col-span-5 lg:text-5xl">One-on-One Dog Training</h2>
        <div className="max-w-[42rem] space-y-5 lg:col-span-7">
          <p>Personalized training gives you focused support for your dog, your goals and your day-to-day routine.</p>
          <p>
            Sessions are designed to help create clearer communication between you and your dog while building
            practical skills that can carry into everyday life.
          </p>
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-24 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-32">
          <div className="lg:col-span-7">
            <p className="eyebrow text-primary">Training May Include</p>
            <h2 className="mt-5 text-4xl lg:text-5xl">What would you like to work on?</h2>
            <p className="mt-6 max-w-[40rem] text-muted-foreground">
              Get in touch to discuss your dog, your current challenges and the goals you would like to work toward.
              Wild West Wags can help determine an appropriate starting point and training plan.
            </p>
            <ul className="mt-10 grid border-t sm:grid-cols-2 sm:gap-x-10">
              {AREAS.map((g, i) => (
                <li key={g} className="flex items-baseline gap-4 border-b py-4">
                  <span className="text-sm font-semibold text-primary">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium">{g}</span>
                </li>
              ))}
            </ul>
          </div>
          <img src={detail.url} alt="Close-up of Trigger looking up attentively" loading="lazy" className="aspect-[3/4] w-full max-w-md justify-self-center object-cover lg:col-span-5" />
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">
        <p className="eyebrow text-primary">Pricing & Availability</p>
        <h2 className="mt-5 text-4xl lg:text-5xl">Let's find the right next step.</h2>
        <p className="mx-auto mt-6 max-w-[40rem] text-muted-foreground">
          Training recommendations depend on your dog, your goals and the type of support you are looking for. Get in
          touch with some information about your dog and what you would like to work on, and Wild West Wags can
          recommend an appropriate next step.
        </p>
        <Link to="/contact" className="btn-primary mt-9">Ask About Training</Link>
      </section>
    </>
  );
}
