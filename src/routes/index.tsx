import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/kt-8.webp.asset.json";
import { pageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Wild West Wags | Dog Training in North Vancouver, BC",
      description:
        "Wild West Wags provides personalized dog training in North Vancouver, BC, focused on practical everyday skills, clearer communication and better life with your dog.",
      path: "/",
    }),
  component: Index,
});

function Index() {
  return (
    <section className="relative isolate flex min-h-[calc(100svh-4rem)] items-end overflow-hidden lg:min-h-[calc(100svh-5rem)]">
      <img
        src={hero.url}
        alt="Kelsey walking with her dog Trigger on a forest trail in North Vancouver"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[60%_center]"
      />
      <div className="absolute inset-0 -z-10 bg-overlay" aria-hidden />
      <div className="mx-auto w-full max-w-7xl px-5 pb-16 pt-32 text-primary-foreground lg:px-10 lg:pb-24">
        <div className="fade-up max-w-2xl">
          <p className="eyebrow">Dog Training • North Vancouver</p>
          <h1 className="mt-5 text-[2.6rem] sm:text-6xl lg:text-[4.5rem]">Training for real life with your dog.</h1>
          <p className="mt-6 max-w-xl text-lg opacity-95">
            Personalized dog training in North Vancouver, BC, designed to help build clearer communication, stronger
            everyday skills, and a better life together.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-6">
            <Link to="/contact" className="btn-light">Get in Touch</Link>
            <span className="text-sm opacity-85">North Vancouver, BC</span>
          </div>
        </div>
      </div>
    </section>
  );
}
