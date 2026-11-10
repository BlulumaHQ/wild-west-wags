// Platform/staging hosts must never be indexed; the custom domain is unaffected.
const PLATFORM_SUFFIXES = [".lovable.app", ".workers.dev", ".pages.dev", ".netlify.app"];

export function isPlatformHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/\.$/, "");
  return PLATFORM_SUFFIXES.some((s) => h.endsWith(s));
}

export function applyRobotsPolicy(request: Request, response: Response): Response {
  let host: string;
  try {
    host = new URL(request.url).hostname;
  } catch {
    return response;
  }
  if (!isPlatformHost(host)) return response;
  if (!(response.headers.get("content-type") ?? "").includes("text/html")) return response;
  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
