import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo.svg";
import { SITE } from "@/lib/site";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services + Pricing" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:h-20 lg:px-10">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Wild West Wags logo" width={56} height={56} className="h-11 w-11 lg:h-14 lg:w-14" />
          <span className="font-display text-xl tracking-tight">Wild West Wags</span>
        </Link>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.95rem]">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="border-b border-transparent py-1 opacity-85 transition hover:opacity-100 data-[status=active]:border-primary-foreground data-[status=active]:opacity-100"
                >
                  {n.label}
                </Link>
              </li>
            ))}
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
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-primary-foreground/15 md:hidden">
          <ul className="px-5 py-3">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="flex min-h-12 items-center font-display text-2xl opacity-85 data-[status=active]:opacity-100"
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
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3 lg:px-10">
        <div>
          <p className="font-display text-2xl">Wild West Wags</p>
          <p className="mt-2 opacity-80">Dog Training in North Vancouver, BC</p>
        </div>
        <div className="space-y-1">
          <a href={SITE.tel} className="block hover:underline">{SITE.phone}</a>
          <a href={`mailto:${SITE.email}`} className="block break-all hover:underline">{SITE.email}</a>
          <a href={SITE.instagram} target="_blank" rel="noopener noreferrer" className="block hover:underline">
            Instagram: {SITE.handle}
          </a>
        </div>
        <nav aria-label="Footer">
          <ul className="space-y-1">
            {NAV.slice(1).map((n) => (
              <li key={n.to}><Link to={n.to} className="hover:underline">{n.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-primary-foreground/15">
        <p className="mx-auto max-w-7xl px-5 py-5 text-sm opacity-75 lg:px-10">
          © {new Date().getFullYear()} Wild West Wags. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export function CtaBand({ heading, body, label }: { heading: string; body?: string; label: string }) {
  return (
    <section className="bg-secondary">
      <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-5 py-20 md:flex-row md:items-end md:justify-between lg:px-10">
        <div>
          <h2 className="text-4xl text-primary md:text-5xl">{heading}</h2>
          {body && <p className="mt-4 max-w-xl text-muted-foreground">{body}</p>}
        </div>
        <Link to="/contact" className="btn-primary shrink-0">{label}</Link>
      </div>
    </section>
  );
}
