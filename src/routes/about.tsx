import { createFileRoute } from "@tanstack/react-router";
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
          <h1 className="mt-5 text-[2.6rem] lg:text-5xl">Building Stronger Connections, One Walk at a Time</h1>
          <div className="mt-6 max-w-[36rem] space-y-5 text-muted-foreground">
            <p>
              I'm the owner and trainer behind Wild West Wags, a North Vancouver dog walking and training business specializing in loose leash walking, everyday skills, and positive reinforcement training.
            </p>
            <p>
              My passion for working with dogs has grown through years of hands-on experience in dog care, pet sitting, and canine rescue, including a year spent working in rescue in remote Australia. These experiences have shaped my understanding of dogs as individuals, each with their own personalities, needs, experiences, and ways of communicating.
            </p>
            <p>
              I believe the relationship between humans and dogs is something truly special — a connection that enriches our lives in immeasurable ways. Helping strengthen that bond, building mutual understanding, and creating positive experiences for the dogs in my care is more than just my profession. It's what I consider my life's purpose.
            </p>
            <p>
              As a certified dog trainer, my approach is rooted in positive reinforcement, force-free methods, and a commitment to understanding the dog in front of me. I believe meaningful progress comes from trust, clear communication, patience, and giving dogs the opportunity to learn in ways that feel safe and rewarding.
            </p>
            <p>
              I have a particular interest in loose leash walking, engagement, and helping dogs navigate the distractions and challenges of everyday life. Whether we're working on leash skills, building confidence, or developing better communication, my focus is on practical, real-world learning that supports both dogs and their people.
            </p>
            <p>
              Through Wild West Wags, my goal is to help create happier, more connected relationships between dogs and their humans while ensuring every dog I work with feels understood, supported, and respected.
            </p>
            <p>
              Because at the heart of it all, I believe life with dogs should be a rewarding experience for both ends of the leash.
            </p>
          </div>
        </div>
        <div className="order-first lg:order-none lg:col-span-7">
          <img src={"/assets/kt-30.webp"} alt="Kelsey kneeling beside Trigger outdoors" className="aspect-[4/3] w-full object-cover" />
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
