import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { auditions } from "../db/schema";
import { AUDITION_CONSENT_TEXT, AUDITION_CONSENT_VERSION, AUDITION_ID_PATTERN, validateAudition, validateAuditionFile, type AuditionMaterialKind } from "./audition-validation";

const MAX_BODY_BYTES = 11 * 1024 * 1024;
const SITE_ORIGIN = "https://james-brown-the-musical.jcormierpres-0628.chatgpt.site";
const KNOWN_ORIGINS = [SITE_ORIGIN, "https://www.jamesbrownthemusical.com", "https://jamesbrownthemusical.com"];
const scalarFields = ["firstName", "middleName", "lastName", "email", "phone", "city", "state", "country", "experience", "videoUrl", "consent", "submissionId"] as const;

function reply(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff", ...headers } });
}

async function readForm(request: Request): Promise<FormData> {
  if (Number(request.headers.get("content-length")) > MAX_BODY_BYTES) throw new Error("too_large");
  if (!request.body) throw new Error("invalid_body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("too_large"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new Response(bytes.buffer, { headers: { "Content-Type": request.headers.get("content-type") ?? "" } }).formData();
}

async function digest(bytes: ArrayBuffer): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, "0")).join("");
}

async function limitSubmission(request: Request): Promise<boolean> {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip || !env.DB) return true;
  const now = Math.floor(Date.now() / 1000);
  const window = Math.floor(now / 600);
  const key = "audition:" + await digest(new TextEncoder().encode(`${SITE_ORIGIN}|${ip}|${window}`).buffer);
  const result = await env.DB.batch<{ requests: number }>([
    env.DB.prepare("DELETE FROM form_rate_limits WHERE expires_at < ?").bind(now),
    env.DB.prepare("INSERT INTO form_rate_limits (key, requests, expires_at) VALUES (?, 1, ?) ON CONFLICT(key) DO UPDATE SET requests = requests + 1 RETURNING requests").bind(key, (window + 1) * 600),
  ]);
  return Number(result[1].results[0]?.requests ?? 100) <= 8;
}

function signatureMatches(bytes: ArrayBuffer, type: string): boolean {
  const value = new Uint8Array(bytes);
  if (type === "image/jpeg") return value.length >= 3 && value[0] === 0xff && value[1] === 0xd8 && value[2] === 0xff;
  if (type === "image/png") return value.length >= 8 && [137, 80, 78, 71, 13, 10, 26, 10].every((byte, index) => value[index] === byte);
  if (type === "image/webp") return value.length >= 12 && new TextDecoder().decode(value.slice(0, 4)) === "RIFF" && new TextDecoder().decode(value.slice(8, 12)) === "WEBP";
  if (type === "application/pdf") return value.length >= 5 && new TextDecoder().decode(value.slice(0, 5)) === "%PDF-";
  return false;
}

function materialExtension(type: string): string {
  return ({ "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "application/pdf": ".pdf" } as Record<string, string>)[type];
}

function safeFilename(file: File, kind: AuditionMaterialKind): string {
  const base = file.name.replace(/\.[^.]*$/, "").replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80) || kind;
  return base + materialExtension(file.type.toLowerCase());
}

export async function handleAudition(request: Request): Promise<Response> {
  const origin = request.headers.get("origin");
  if (!origin || ![...KNOWN_ORIGINS, new URL(request.url).origin].includes(origin) || request.headers.get("sec-fetch-site") === "cross-site") {
    return reply({ ok: false, message: "Please submit your materials from the James Brown The Musical website." }, 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("multipart/form-data;")) {
    return reply({ ok: false, message: "The submission format was not recognized. Please refresh the page and try again." }, 415);
  }

  let form: FormData;
  try { form = await readForm(request); }
  catch (error) {
    const large = error instanceof Error && error.message === "too_large";
    return reply({ ok: false, message: large ? "Your submission is too large. Use a headshot and résumé of 5 MB or smaller each." : "We couldn’t read your submission. Please try again." }, large ? 413 : 400);
  }
  const honeypot = form.get("website");
  if (typeof honeypot === "string" && honeypot.trim()) {
    const supplied = form.get("submissionId");
    return reply({ ok: true, reference: typeof supplied === "string" && AUDITION_ID_PATTERN.test(supplied) ? supplied : crypto.randomUUID() });
  }

  const values: Record<string, unknown> = {};
  for (const field of scalarFields) values[field] = form.get(field) ?? "";
  values.disciplines = form.getAll("disciplines");
  values.productions = form.getAll("productions");
  const { errors, data } = validateAudition(values);
  for (const field of scalarFields) {
    if (form.getAll(field).length > 1 || (form.get(field) !== null && typeof form.get(field) !== "string")) errors[field] = "Please check this field and submit again.";
  }
  const headshotValue = form.get("headshot");
  const resumeValue = form.get("resume");
  const headshot = headshotValue instanceof File ? headshotValue : null;
  const resume = resumeValue instanceof File ? resumeValue : null;
  for (const [kind, file] of [["headshot", headshot], ["resume", resume]] as const) {
    const error = validateAuditionFile(file, kind);
    if (error) errors[kind] = error;
    if (form.getAll(kind).length > 1) errors[kind] = `Choose only one ${kind === "resume" ? "résumé" : "headshot"} file.`;
  }
  if (Object.keys(errors).length || !headshot || !resume) return reply({ ok: false, errors, message: "Please check the highlighted fields." }, 400);
  if (!env.DB || !env.BUCKET) return reply({ ok: false, message: "Submissions are temporarily unavailable. Your details are still in the form—please try again shortly." }, 503);

  const bucket = env.BUCKET;
  let attemptKeys: string[] = [];
  let insertAttempted = false;
  let payloadHash = "";
  const db = getDb();
  const existingSubmission = () => db.select().from(auditions).where(eq(auditions.id, data.submissionId)).get();
  const success = () => reply({ ok: true, reference: data.submissionId });
  const conflict = () => reply({ ok: false, message: "This submission reference is already in use. Please refresh the page to start a new submission." }, 409);
  async function cleanAttempt() {
    if (!attemptKeys.length) return;
    try { await bucket.delete(attemptKeys); }
    catch { console.error("An uncommitted audition upload could not be removed."); }
  }

  try {
    const [headshotBytes, resumeBytes] = await Promise.all([headshot.arrayBuffer(), resume.arrayBuffer()]);
    const headshotType = headshot.type.toLowerCase();
    const resumeType = resume.type.toLowerCase();
    if (!signatureMatches(headshotBytes, headshotType)) errors.headshot = "This file does not match a supported image format. Upload a JPEG, PNG or WebP headshot.";
    if (!signatureMatches(resumeBytes, resumeType)) errors.resume = "This file does not appear to be a PDF. Upload your résumé as a PDF.";
    if (Object.keys(errors).length) return reply({ ok: false, errors, message: "Please check the highlighted files." }, 400);

    const headshotName = safeFilename(headshot, "headshot");
    const resumeName = safeFilename(resume, "resume");
    const [headshotHash, resumeHash] = await Promise.all([digest(headshotBytes), digest(resumeBytes)]);
    payloadHash = await digest(new TextEncoder().encode(JSON.stringify({ ...data, headshotHash, resumeHash, headshotType, resumeType, headshotName, resumeName, consentVersion: AUDITION_CONSENT_VERSION })).buffer);

    const existing = await existingSubmission();
    if (existing) return existing.payloadHash === payloadHash ? success() : conflict();
    if (!await limitSubmission(request)) return reply({ ok: false, message: "You’ve submitted several auditions recently. Please wait a few minutes before trying again." }, 429, { "Retry-After": "600" });

    // Each request uploads to an isolated attempt prefix. Concurrent retries can
    // never overwrite a winning request's files, even when their IDs match.
    const prefix = `auditions/${data.submissionId}/${crypto.randomUUID()}`;
    const headshotKey = `${prefix}/headshot${materialExtension(headshotType)}`;
    const resumeKey = `${prefix}/resume.pdf`;
    attemptKeys = [headshotKey, resumeKey];
    await bucket.put(headshotKey, headshotBytes, { httpMetadata: { contentType: headshotType, contentDisposition: `attachment; filename="${headshotName}"` } });
    await bucket.put(resumeKey, resumeBytes, { httpMetadata: { contentType: resumeType, contentDisposition: `attachment; filename="${resumeName}"` } });
    const now = new Date().toISOString();
    insertAttempted = true;
    const inserted = await db.insert(auditions).values({
      id: data.submissionId, firstName: data.firstName, middleName: data.middleName || null, lastName: data.lastName,
      email: data.email, phone: data.phone || null, city: data.city, state: data.state || null, country: data.country,
      disciplines: data.disciplines, productions: data.productions, experience: data.experience || null, videoUrl: data.videoUrl || null,
      headshotKey, headshotName, headshotType, headshotSize: headshot.size,
      resumeKey, resumeName, resumeType, resumeSize: resume.size,
      payloadHash, consentText: AUDITION_CONSENT_TEXT, consentVersion: AUDITION_CONSENT_VERSION, consentAt: now, createdAt: now,
    }).onConflictDoNothing({ target: auditions.id }).returning({ id: auditions.id });
    if (inserted.length) return success();
    const winner = await existingSubmission();
    await cleanAttempt();
    return winner?.payloadHash === payloadHash ? success() : conflict();
  } catch {
    // A network error can occur after D1 committed. Check ownership before
    // removing files; never delete materials referenced by a saved submission.
    if (insertAttempted) {
      try {
        const saved = await existingSubmission();
        const ownsFiles = !!saved && attemptKeys.includes(saved.headshotKey);
        if (!ownsFiles) await cleanAttempt();
        if (saved) return saved.payloadHash === payloadHash ? success() : conflict();
      } catch {
        // Retain uncertain uploads rather than risk deleting committed files.
        console.error("An audition write could not be confirmed; uploaded materials were retained for reconciliation.");
      }
    } else await cleanAttempt();
    console.error("An audition submission could not be saved.");
    return reply({ ok: false, message: "We couldn’t confirm your submission. Your details are still in the form—please try again." }, 503);
  }
}
