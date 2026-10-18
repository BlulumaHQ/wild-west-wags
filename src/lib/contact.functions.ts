import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().default(""),
  dogName: z.string().trim().max(80).optional().default(""),
  dogAge: z.string().trim().max(40).optional().default(""),
  message: z.string().trim().min(1).max(5000),
  preferred: z.enum(["Email", "Phone"]).default("Email"),
  website: z.string().max(0).optional().default(""), // honeypot
});

// Best-effort per-instance rate limit.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const sendInquiry = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => contactSchema.parse(d))
  .handler(async ({ data }) => {
    if (data.website) return { ok: true }; // silently drop bots
    const ip = getRequestHeader("cf-connecting-ip") ?? getRequestHeader("x-forwarded-for") ?? "unknown";
    if (limited(ip)) return { ok: false };
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.error("RESEND_API_KEY missing");
      return { ok: false };
    }
    const ts = new Date().toLocaleString("en-CA", { timeZone: "America/Vancouver", dateStyle: "long", timeStyle: "short" });
    const rows: [string, string][] = [
      ["Name", data.name],
      ["Email", data.email],
      ["Phone", data.phone || "—"],
      ["Dog’s Name", data.dogName || "—"],
      ["Dog’s Age", data.dogAge || "—"],
      ["Preferred Contact Method", data.preferred],
    ];
    const html = `<div style="font-family:sans-serif;color:#222722">
      <h2 style="color:#195420">New Wild West Wags Website Inquiry</h2>
      <table>${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0"><b>${k}</b></td><td>${esc(v)}</td></tr>`).join("")}</table>
      <h3>Message</h3><p style="white-space:pre-wrap">${esc(data.message)}</p>
      <p style="color:#666;font-size:12px">Submitted ${ts} (Vancouver time)</p></div>`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.RESEND_FROM ?? "Wild West Wags Website <onboarding@resend.dev>",
        to: ["wildwestwags604@gmail.com"],
        reply_to: data.email,
        subject: "New Wild West Wags Website Inquiry",
        html,
      }),
    });
    if (!res.ok) {
      console.error("Resend failed", res.status, await res.text());
      return { ok: false };
    }
    return { ok: true };
  });
