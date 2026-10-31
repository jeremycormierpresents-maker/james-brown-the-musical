export type FormKind = "signup" | "contact";
export type FieldErrors = Record<string, string>;
export const CONSENT_TEXT = "I’d like to receive email updates from James Brown The Musical.";
export const CONSENT_VERSION = "email-updates-v1";
export const SUBJECTS = ["General inquiry", "Press & media", "Partnerships", "Other"] as const;
export function validateForm(kind: FormKind, values: Record<string, unknown>) {
  const errors: FieldErrors = {};
  const email = typeof values.email === "string" ? values.email.trim().toLowerCase() : "";
  const name = typeof values.name === "string" ? values.name.trim() : "";
  const message = typeof values.message === "string" ? values.message.trim() : "";
  const subject = typeof values.subject === "string" ? values.subject : "General inquiry";
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Enter a valid email address.";
  if (kind === "signup") { if (name.length > 80) errors.name = "Use 80 characters or fewer."; if (values.consent !== true) errors.consent = "Please agree to receive updates to join the list."; }
  else { if (!name) errors.name = "Please enter your name."; else if (name.length > 120) errors.name = "Use 120 characters or fewer."; if (!message) errors.message = "Please enter your message."; else if (message.length > 5000) errors.message = "Keep your message to 5,000 characters or fewer."; if (!(SUBJECTS as readonly string[]).includes(subject)) errors.subject = "Choose a topic from the list."; }
  return { errors, data: { name, email, subject, message } };
}
