import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Instagram } from "lucide-react";
import portrait from "@/assets/kt-32.webp.asset.json";
import { pageHead, SITE } from "@/lib/site";
import { sendInquiry } from "@/lib/contact.functions";

export const Route = createFileRoute("/contact")({
  head: () =>
    pageHead({
      title: "Contact Wild West Wags | North Vancouver Dog Trainer",
      description: "Tell Wild West Wags about your dog and what you'd like to work on. Dog training in North Vancouver, BC.",
      path: "/contact",
    }),
  component: Contact,
});

function Field({ id, label, required, children }: { id: string; label: string; required?: boolean; children?: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label} {required && <span className="text-primary" aria-hidden>*</span>}
      </label>
      {children ?? <input id={id} name={id} required={required} className="field" />}
    </div>
  );
}

function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setState("sending");
    try {
      const r = await sendInquiry({ data: f });
      setState(r.ok ? "ok" : "error");
      if (r.ok) (e.target as HTMLFormElement).reset();
    } catch {
      setState("error");
    }
  }

  return (
    <section className="mx-auto grid max-w-[1320px] gap-14 px-5 pb-24 pt-36 lg:grid-cols-12 lg:gap-16 lg:px-10 lg:pb-32 lg:pt-44">
      <div className="lg:col-span-5">
        <p className="eyebrow text-primary">Contact</p>
        <h1 className="mt-5 text-[2.6rem] lg:text-6xl">Let’s talk about your dog.</h1>
        <p className="mt-6 text-muted-foreground">
          Tell us a little about your dog, what you would like to work on and the kind of support you are looking for.
        </p>
        <p className="mt-4 text-muted-foreground">Send a message and Wild West Wags will follow up to discuss the next step.</p>
        <address className="mt-10 space-y-1.5 border-t pt-8 not-italic">
          <p className="font-display text-xl font-semibold">Wild West Wags</p>
          <p className="text-muted-foreground">North Vancouver, BC</p>
          <a href={SITE.tel} className="block pt-3 transition hover:text-primary">{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="block break-all transition hover:text-primary">{SITE.email}</a>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 transition hover:text-primary"
          >
            <Instagram className="h-4 w-4 text-primary" aria-hidden />
            {SITE.handle}
          </a>
        </address>
        <img src={portrait.url} alt="Kelsey standing outdoors with Trigger at her side" loading="lazy" className="mt-10 hidden aspect-[4/5] w-full object-cover lg:block" />
      </div>

      <div className="lg:col-span-7">
        {state === "ok" ? (
          <div role="status" className="border-l-2 border-primary bg-secondary p-8">
            <p className="font-display text-2xl font-semibold">Thanks for getting in touch. Your message has been sent to Wild West Wags.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6 border bg-card p-6 sm:p-10" noValidate={false}>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="name" label="Your Name" required />
              <Field id="email" label="Email Address" required>
                <input id="email" name="email" type="email" required autoComplete="email" className="field" />
              </Field>
              <Field id="phone" label="Phone Number">
                <input id="phone" name="phone" type="tel" autoComplete="tel" className="field" />
              </Field>
              <Field id="dogName" label="Dog’s Name" />
              <Field id="dogAge" label="Dog’s Age" />
              <Field id="preferred" label="Preferred Contact Method">
                <select id="preferred" name="preferred" className="field" defaultValue="Email">
                  <option>Email</option>
                  <option>Phone</option>
                </select>
              </Field>
            </div>
            <Field id="message" label="What would you like help with?" required>
              <textarea id="message" name="message" required rows={6} className="field" />
            </Field>
            <div className="absolute -left-[9999px]" aria-hidden>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            {state === "error" && (
              <p role="alert" className="text-destructive">
                Sorry, your message could not be sent. Please try again or email{" "}
                <a href={`mailto:${SITE.email}`} className="underline">{SITE.email}</a> directly.
              </p>
            )}
            <button type="submit" className="btn-primary w-full sm:w-auto" disabled={state === "sending"}>
              {state === "sending" ? "Sending…" : "Send Inquiry"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
