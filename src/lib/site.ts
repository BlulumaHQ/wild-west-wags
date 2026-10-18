export const SITE = {
  name: "Wild West Wags",
  url: "https://wildwestwags.ca",
  email: "wildwestwags604@gmail.com",
  phone: "604-723-6815",
  tel: "tel:+16047236815",
  instagram: "https://www.instagram.com/wildwestwags/",
  handle: "@wildwestwags",
};

export function pageHead(o: { title: string; description: string; path: string; image?: string }) {
  const meta = [
    { title: o.title },
    { name: "description", content: o.description },
    { property: "og:title", content: o.title },
    { property: "og:description", content: o.description },
    { property: "og:type", content: "website" },
    { property: "og:url", content: SITE.url + o.path },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: o.title },
    { name: "twitter:description", content: o.description },
  ];
  if (o.image) meta.push({ property: "og:image", content: o.image }, { name: "twitter:image", content: o.image });
  return { meta, links: [{ rel: "canonical", href: SITE.url + o.path }] };
}
