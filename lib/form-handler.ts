import { env } from "cloudflare:workers";
import { getDb } from "../db";
import { messages, signups } from "../db/schema";
import { CONSENT_TEXT, CONSENT_VERSION, validateForm, type FormKind } from "./form-validation";
const MAX_BODY_BYTES = 32768;
const SITE_ORIGIN = "https://james-brown-the-musical.jcormierpres-0628.chatgpt.site";
const reply = (body: unknown, status = 200, headers: Record<string, string> = {}) => Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
async function readBody(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new Error("too_large");
  if (!request.body) throw new Error("invalid_json");
  const reader = request.body.getReader(); const chunks: Uint8Array[] = []; let size = 0;
  try { for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.byteLength; if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("too_large"); } chunks.push(value); } } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}
async function limitSubmission(request: Request): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip"); if (!ip || !env.DB) return true;
  const now = Math.floor(Date.now() / 1000); const window = Math.floor(now / 600);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${SITE_ORIGIN}|${ip}|${window}`));
  const key = Array.from(new Uint8Array(digest)).map(value => value.toString(16).padStart(2, "0")).join("");
  const results = await env.DB.batch<{ requests: number }>([env.DB.prepare("DELETE FROM form_rate_limits WHERE expires_at < ?").bind(now), env.DB.prepare("INSERT INTO form_rate_limits (key, requests, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET requests = requests + 1 RETURNING requests").bind(key, (window + 1) * 600)]);
  return Number(results[1].results[0]?.requests ?? 100) <= 8;
}
export async function handleForm(request: Request, kind: FormKind) {
  const origin = request.headers.get("origin"); const requestOrigin = new URL(request.url).origin;
  if (!origin || ![SITE_ORIGIN, requestOrigin].includes(origin) || request.headers.get("sec-fetch-site") === "cross-site") return reply({ ok: false, message: "Please submit the form from the James Brown The Musical website." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) return reply({ ok: false, message: "The submission format was not recognized. Please try again." }, 415);
  let input: unknown;
  try { input = await readBody(request); } catch (error) { const large = error instanceof Error && error.message === "too_large"; return reply({ ok: false, message: large ? "Your message is too long. Please shorten it and try again." : "We couldn’t read the submission. Please try again." }, large ? 413 : 400); }
  if (!input || typeof input !== "object" || Array.isArray(input)) return reply({ ok: false, message: "Please complete the form and try again." }, 400);
  const values = input as Record<string, unknown>;
  if (typeof values.website === "string" && values.website.trim()) return reply({ ok: true });
  const { errors, data } = validateForm(kind, values);
  if (Object.keys(errors).length) return reply({ ok: false, errors, message: "Please check the highlighted fields." }, 400);
  try {
    if (!await limitSubmission(request)) return reply({ ok: false, message: "You’ve submitted several forms recently. Please wait a few minutes before trying again." }, 429, { "Retry-After": "600" });
    const db = getDb(); const now = new Date().toISOString();
    if (kind === "signup") await db.insert(signups).values({ id: crypto.randomUUID(), firstName: data.name || null, email: data.email, consentText: CONSENT_TEXT, consentVersion: CONSENT_VERSION, consentAt: now, createdAt: now }).onConflictDoNothing({ target: signups.email });
    else await db.insert(messages).values({ id: crypto.randomUUID(), name: data.name, email: data.email, subject: data.subject, message: data.message, createdAt: now });
    return reply({ ok: true });
  } catch { console.error("A musical form submission could not be saved."); return reply({ ok: false, message: "We couldn’t save your submission right now. Your details are still in the form—please try again." }, 503); }
}
