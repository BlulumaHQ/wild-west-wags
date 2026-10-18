import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header, Footer } from "@/components/site-chrome";
import { SITE } from "@/lib/site";

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="eyebrow text-primary">404</p>
      <h1 className="mt-4 text-5xl">This trail doesn't go anywhere.</h1>
      <p className="mt-4 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-8">Back to Home</Link>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <h1 className="text-4xl">This page didn't load</h1>
      <p className="mt-4 text-muted-foreground">Something went wrong. Please try again shortly.</p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        className="btn-primary mt-8"
      >
        Try Again
      </button>
    </div>
  );
}

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  description: "Personalized dog training in North Vancouver, BC.",
  url: SITE.url,
  telephone: "+1-604-723-6815",
  email: SITE.email,
  address: { "@type": "PostalAddress", addressLocality: "North Vancouver", addressRegion: "BC", addressCountry: "CA" },
  areaServed: "North Vancouver, BC",
  sameAs: [SITE.instagram],
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#195420" },
      { property: "og:site_name", content: "Wild West Wags" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700&display=swap",
      },
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(localBusiness) }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en-CA">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:bg-background focus:p-3">
        Skip to content
      </a>
      <Header />
      <main id="main" className="min-h-svh">
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
