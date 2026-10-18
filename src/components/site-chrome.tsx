import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Instagram, Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services + Pricing" },
  { to: "/blog", label: "Blog" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const onHome = pathname === "/";
  const transparent = onHome && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        transparent ? "bg-transparent text-white" : "border-b bg-background text-foreground"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 lg:h-24 lg:px-10">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Wild West Wags logo"
            className="h-16 w-auto lg:h-20"
          />
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-9 text-[0.9rem] font-medium">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className={`border-b border-transparent py-1 transition ${
                    transparent
                      ? "opacity-90 hover:opacity-100 data-[status=active]:border-white data-[status=active]:opacity-100"
                      : "opacity-80 hover:text-primary hover:opacity-100 data-[status=active]:border-primary data-[status=active]:text-primary data-[status=active]:opacity-100"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/contact"
                className={`inline-flex min-h-11 items-center border px-5 text-[0.9rem] font-semibold transition ${
                  transparent
                    ? "border-white/70 text-white hover:bg-white/10"
                    : "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <button
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background text-foreground md:hidden">
          <ul className="px-5 py-3">
            {[...NAV, { to: "/contact", label: "Contact" } as const].map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center font-display text-xl font-semibold opacity-85 data-[status=active]:text-primary data-[status=active]:opacity-100"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t bg-secondary">
      <div className="mx-auto max-w-[1320px] px-5 py-10 lg:px-10 lg:py-20">
        {/* Mobile: compact single column. Desktop: unchanged 12-col layout. */}
        <div className="md:hidden">
          <img src={logo} alt="Wild West Wags logo" className="h-12 w-auto" />
          <nav aria-label="Footer" className="mt-5">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem] font-medium">
              {[...NAV.slice(1), { to: "/contact", label: "Contact" } as const].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="transition hover:text-primary">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-4 space-y-1 text-sm text-muted-foreground">
            <a href={SITE.tel} className="block transition hover:text-foreground">{SITE.phone}</a>
            <a href={`mailto:${SITE.email}`} className="block transition hover:text-foreground">{SITE.email}</a>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-foreground"
            >
              <Instagram className="h-4 w-4 text-primary" aria-hidden />
              {SITE.handle}
            </a>
          </div>
        </div>

        {/* Desktop / tablet layout */}
        <div className="hidden gap-12 md:grid md:grid-cols-12">
          <div className="md:col-span-5">
            <img src={logo} alt="Wild West Wags logo" className="h-24 w-auto lg:h-28" />
            <p className="mt-6 max-w-xs text-muted-foreground">
              Practical dog training for better everyday life together.
            </p>
            <p className="mt-2 text-muted-foreground">North Vancouver, BC</p>
          </div>
          <nav aria-label="Footer" className="md:col-span-3">
            <p className="eyebrow text-primary">Explore</p>
            <ul className="mt-5 space-y-2.5">
              {[...NAV.slice(1), { to: "/contact", label: "Contact" } as const].map((n) => (
                <li key={n.to}>
                  <Link to={n.to} className="transition hover:text-primary">{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="md:col-span-4">
            <p className="eyebrow text-primary">Get in Touch</p>
            <div className="mt-5 space-y-2.5">
              <a href={SITE.tel} className="block transition hover:text-primary">{SITE.phone}</a>
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
            </div>
          </div>
        </div>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-[1320px] px-5 py-5 text-sm text-muted-foreground lg:px-10 lg:py-6">
          © {new Date().getFullYear()} Wild West Wags. All rights reserved.
          <br />
          Web Design by{" "}
          <a
            href="https://sonykundesign.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-border underline-offset-2 transition hover:text-foreground hover:decoration-foreground"
          >
            sonykundesign.com
          </a>
        </p>
      </div>
    </footer>
  );
}

export function CtaBand({ heading, body, label }: { heading: string; body?: string; label: string }) {
  return (
    <section className="bg-warm">
      <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 px-5 py-24 md:flex-row md:items-end md:justify-between lg:px-10 lg:py-32">
        <div>
          <span className="rule-line text-primary" />
          <h2 className="mt-6 max-w-xl text-4xl lg:text-5xl">{heading}</h2>
          {body && <p className="mt-5 max-w-xl text-muted-foreground">{body}</p>}
        </div>
        <Link to="/contact" className="btn-primary shrink-0">{label}</Link>
      </div>
    </section>
  );
}
