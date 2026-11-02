import goodDog from "@/assets/good-dog-academy-graduate.webp.asset.json";
import dogsafe from "@/assets/dogsafe-certified.webp.asset.json";
import capdt from "@/assets/capdt.webp.asset.json";
import profur from "@/assets/profur-insured.webp.asset.json";

const LOGOS = [
  { src: goodDog.url, alt: "Good Dog Academy Professional Dog Trainer graduate", href: null },
  { src: dogsafe.url, alt: "DOGSAFE Canine First Aid certified", href: "https://www.dogsafe.ca/" },
  { src: capdt.url, alt: "Canadian Association of Professional Dog Trainers member", href: "https://capdt.ca/" },
  { src: profur.url, alt: "PROfur insured", href: "https://profur.ca/" },
] as const;

export function CredentialLogos({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid grid-cols-2 items-center gap-x-8 gap-y-10 lg:grid-cols-4 ${className}`}>
      {LOGOS.map((l) => {
        const img = (
          <img src={l.src} alt={l.alt} loading="lazy" className="h-[70px] w-auto max-w-full object-contain lg:h-[88px]" />
        );
        return (
          <li key={l.src} className="flex justify-center">
            {l.href ? (
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="transition-opacity hover:opacity-75">
                {img}
              </a>
            ) : (
              img
            )}
          </li>
        );
      })}
    </ul>
  );
}
