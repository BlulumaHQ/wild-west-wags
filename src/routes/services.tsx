import { createFileRoute, Link } from "@tanstack/react-router";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/services")({
  head: () =>
    pageHead({
      title: "Services + Pricing | Wild West Wags North Vancouver",
      description:
        "Dog walking, skill-building walks, private training and pet sitting in North Vancouver. Private walks from $45, skill-building walks $75, training sessions $95.",
      path: "/services",
    }),
  component: Services,
});

type Service = { name: string; price: string; description: string; includes?: string[] };

const DOG_WALKING: Service[] = [
  {
    name: "Private Walks",
    price: "45 min — $45 · 60 min — $50",
    description:
      "One-on-one walks tailored to your dog's energy, personality, and needs. A balance of exercise, exploration, enrichment, and personalized attention.",
  },
  {
    name: "Buddy Walks",
    price: "60 min — $45 per dog",
    description:
      "A personalized alternative to traditional pack walks. Two carefully matched dogs enjoy positive companionship and enrichment with training-informed handling and a maximum of two dogs per walk.",
  },
];

const TRAINING: Service[] = [
  {
    name: "Skill-Building Walks",
    price: "60 min — $75",
    description:
      "Purposeful one-on-one walks incorporating structured real-world practice. Focus areas may include loose-leash walking, recall foundations, engagement and check-ins, managing distractions, and building calmer responses to the environment.",
  },
  {
    name: "Private Training Sessions",
    price: "$95",
    description:
      "Individualized, hands-on coaching for dogs and owners. Develop practical skills, improve communication, and learn techniques to carry into everyday routines.",
  },
];

const PACKAGES: Service[] = [
  {
    name: "Foundations",
    price: "$350",
    includes: ["1 initial assessment", "3 individual skill-building walks", "1 private session with owner"],
    description: "A focused introduction to foundational skills, consistency, and practical owner guidance.",
  },
  {
    name: "Progression",
    price: "$595",
    includes: [
      "1 initial assessment",
      "5 individual skill-building walks",
      "1 midway private session with owner",
      "1 final private session with owner",
    ],
    description: "Additional practice and coaching to strengthen skills and build consistency over time.",
  },
];

const AREAS_SERVED = ["Upper Lonsdale", "Lynn Valley", "Delbrook", "Edgemont"];

function ServiceList({ items }: { items: Service[] }) {
  return (
    <ul className="border-t">
      {items.map((s) => (
        <li key={s.name} className="grid gap-3 border-b py-8 lg:grid-cols-12 lg:gap-10">
          <h3 className="font-display text-2xl font-semibold lg:col-span-4">{s.name}</h3>
          <p className="font-display text-xl font-semibold text-primary lg:col-span-3">{s.price}</p>
          <div className="lg:col-span-5">
            {s.includes && (
              <ul className="mb-3 space-y-1 text-[0.95rem] font-medium">
                {s.includes.map((i) => (
                  <li key={i} className="flex gap-2">
                    <span aria-hidden className="text-primary">·</span>
                    {i}
                  </li>
                ))}
              </ul>
            )}
            <p className="text-muted-foreground">{s.description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Services() {
  return (
    <>
      <section className="mx-auto max-w-[1320px] px-5 pt-36 lg:px-10 lg:pt-44">
        <div className="fade-up max-w-3xl">
          <p className="eyebrow text-primary">Services + Pricing</p>
          <h1 className="mt-5 text-[2rem] lg:text-4xl">Dog Walking, Skill Building &amp; Training</h1>
          <p className="mt-6 max-w-[42rem] text-lg text-muted-foreground">
            Thoughtful, individualized care that supports your dog's everyday needs, confidence, and practical skills.
          </p>
        </div>
        <img src={"/assets/kt-41.webp"} alt="Kelsey working with Trigger during an outdoor training session" className="mt-14 aspect-[16/10] w-full object-cover lg:aspect-[21/9]" />
      </section>

      {/* Dog walking */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-20">
        <ServiceList items={DOG_WALKING} />
      </section>

      {/* Skill building & training */}
      <section className="bg-secondary">
        <div className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-20">
          <ServiceList items={TRAINING} />
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 lg:px-10 lg:py-20">
        <p className="eyebrow mb-8 text-primary">Skill-Building Packages</p>
        <ServiceList items={PACKAGES} />
        <img src={"/assets/kt-8.webp"} alt="Kelsey walking with Trigger on a forest trail in North Vancouver" loading="lazy" className="mt-16 aspect-[16/10] w-full object-cover lg:aspect-[21/9]" />
      </section>

      {/* Pet sitting */}
      <section className="border-t">
        <div className="mx-auto grid max-w-[1320px] items-center gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:py-20">
          <div className="lg:col-span-7">
            <h2 className="font-display text-2xl font-semibold">Pet Sitting</h2>
            <p className="mt-6 font-display text-xl font-semibold text-primary">Starting at $100 minimum per night.</p>
            <p className="mt-4 max-w-[40rem] text-muted-foreground">
              Please contact Wild West Wags for availability and final pricing.
            </p>
            <Link to="/contact" className="btn-outline-dark mt-8">Ask About Pet Sitting</Link>
          </div>
          <img src={"/assets/kt-36.webp"} alt="Close-up of Trigger looking up attentively" loading="lazy" className="aspect-[3/4] w-full max-w-md justify-self-center object-cover lg:col-span-5" />
        </div>
      </section>

      {/* Areas + approach */}
      <section className="bg-warm">
        <div className="mx-auto grid max-w-[1320px] gap-14 px-5 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-32">
          <div>
            <p className="eyebrow text-primary">Areas We Serve</p>
            <h2 className="mt-5 text-4xl lg:text-5xl">Select North Vancouver neighbourhoods.</h2>
            <ul className="mt-10 grid grid-cols-2 border-t">
              {AREAS_SERVED.map((a) => (
                <li key={a} className="border-b py-4 font-medium">{a}</li>
              ))}
            </ul>
            <p className="mt-5 text-sm text-muted-foreground">Serving select North Vancouver neighbourhoods.</p>
          </div>
          <div>
            <p className="eyebrow text-primary">Our Approach</p>
            <p className="mt-6 max-w-[38rem] text-muted-foreground">
              We focus on positive reinforcement, thoughtful management, and consistent practice in everyday
              environments. Every dog learns at their own pace, and services are tailored to their individual needs.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-5 py-24 text-center lg:py-32">
        <span className="rule-line mx-auto text-primary" />
        <h2 className="mt-6 text-4xl lg:text-5xl">Not sure which service is the right fit?</h2>
        <p className="mx-auto mt-6 max-w-[40rem] text-muted-foreground">
          Tell us a little about your dog, your routine, and what you would like help with. We can discuss the most
          appropriate next step.
        </p>
        <Link to="/contact" className="btn-primary mt-9">Get in Touch</Link>
      </section>
    </>
  );
}
