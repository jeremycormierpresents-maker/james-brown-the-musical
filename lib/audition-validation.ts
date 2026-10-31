export type AuditionFieldErrors = Record<string, string>;
export type AuditionMaterialKind = "headshot" | "resume";

export const DISCIPLINES = [
  { value: "actor", label: "Actor" },
  { value: "singer", label: "Singer" },
  { value: "dancer", label: "Dancer" },
  { value: "musician", label: "Musician" },
] as const;

export const PRODUCTIONS = [
  { value: "atlanta", label: "World Premiere: Atlanta" },
  { value: "tour", label: "National Tour" },
  { value: "broadway", label: "Broadway" },
] as const;

export const MAX_FILE_BYTES = 5 * 1024 * 1024;
export const AUDITION_CONSENT_TEXT = "I agree that James Brown The Musical may use my details and submitted materials to consider me for casting and contact me about my submission.";
export const AUDITION_CONSENT_VERSION = "audition-casting-v1";
export const AUDITION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function validateAudition(values: Record<string, unknown>) {
  const errors: AuditionFieldErrors = {};
  const text = (name: string) => typeof values[name] === "string" ? (values[name] as string).trim() : "";
  const name = text("name");
  const email = text("email").toLowerCase();
  const phone = text("phone");
  const location = text("location");
  const experience = text("experience");
  let videoUrl = text("videoUrl");
  const submissionId = text("submissionId").toLowerCase();
  const consent = values.consent === true || values.consent === "on";

  if (!name) errors.name = "Enter your full name.";
  else if (name.length > 120) errors.name = "Use 120 characters or fewer.";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (phone.length > 40) errors.phone = "Use 40 characters or fewer.";
  if (!location) errors.location = "Enter your city and state or country.";
  else if (location.length > 160) errors.location = "Use 160 characters or fewer.";
  if (experience.length > 3000) errors.experience = "Keep your experience to 3,000 characters or fewer.";
  if (!AUDITION_ID_PATTERN.test(submissionId)) errors.submissionId = "Please refresh this page before submitting your materials.";

  function selection(field: string, options: readonly { value: string; label: string }[], message: string) {
    const input = values[field];
    if (!Array.isArray(input) || input.length === 0 || input.length > options.length || input.some(value => typeof value !== "string" || !options.some(option => option.value === value))) {
      errors[field] = message;
      return [];
    }
    return options.filter(option => input.includes(option.value)).map(option => option.value);
  }
  const disciplines = selection("disciplines", DISCIPLINES, "Choose at least one performance interest from the options.");
  const productions = selection("productions", PRODUCTIONS, "Choose at least one production from the options.");

  if (videoUrl) {
    try {
      const parsed = new URL(videoUrl);
      if (videoUrl.length > 2048 || !["http:", "https:"].includes(parsed.protocol) || !parsed.hostname || parsed.username || parsed.password || parsed.href.length > 2048) throw new Error("invalid_url");
      videoUrl = parsed.href;
    } catch { errors.videoUrl = "Enter a complete http:// or https:// video link, without a username or password."; }
  }
  if (!consent) errors.consent = "Please agree to the use of your details and materials for casting consideration.";

  return { errors, data: { name, email, phone, location, disciplines, productions, experience, videoUrl, consent, submissionId } };
}

export function validateAuditionFile(file: File | null, kind: AuditionMaterialKind): string | null {
  const label = kind === "headshot" ? "headshot" : "résumé";
  if (!file || !file.size) return `Choose your ${label} file.`;
  if (file.size > MAX_FILE_BYTES) return `Your ${label} must be 5 MB or smaller.`;
  if (kind === "headshot" && !["image/jpeg", "image/png", "image/webp"].includes(file.type.toLowerCase())) return "Choose a JPEG, PNG or WebP headshot.";
  if (kind === "resume" && file.type.toLowerCase() !== "application/pdf") return "Choose a PDF résumé.";
  return null;
}
