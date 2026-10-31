"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CONSENT_TEXT, SUBJECTS, validateForm, type FieldErrors, type FormKind } from "../../lib/form-validation";
function Arrow() { return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }

export function SubmissionForm({ kind }: { kind: FormKind }) {
  const isSignup = kind === "signup";
  const [status, setStatus] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [notice, setNotice] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);
  function focusError(fieldErrors: FieldErrors) { requestAnimationFrame(() => { const first = Object.keys(fieldErrors)[0]; if (!first) return; const input = formRef.current?.elements.namedItem(first); if (input instanceof HTMLElement) input.focus(); }); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (pending.current) return;
    const form = event.currentTarget; const fields = new FormData(form);
    const values = { name: fields.get("name") ?? "", email: fields.get("email") ?? "", subject: fields.get("subject") ?? "General inquiry", message: fields.get("message") ?? "", consent: fields.get("consent") === "on", website: fields.get("website") ?? "" };
    const checked = validateForm(kind, values); setErrors(checked.errors); setNotice("");
    if (Object.keys(checked.errors).length) { setStatus("error"); setNotice("Please check the highlighted fields."); focusError(checked.errors); return; }
    pending.current = true; setStatus("pending");
    const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch(`/api/${kind}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values), signal: controller.signal });
      const result = await response.json().catch(() => null) as { ok?: boolean; errors?: FieldErrors; message?: string } | null;
      if (!response.ok || !result?.ok) { const fieldErrors = result?.errors ?? {}; setErrors(fieldErrors); setStatus("error"); setNotice(result?.message ?? "We couldn’t save your submission. Please try again."); focusError(fieldErrors); return; }
      form.reset(); setStatus("success"); setNotice("");
    } catch { setStatus("error"); setNotice("We couldn’t confirm your submission. Check your connection and try again."); }
    finally { clearTimeout(timeout); pending.current = false; }
  }
  function errorFor(field: string) { return errors[field] ? <p className="field-error" id={`${kind}-${field}-error`}>{errors[field]}</p> : null; }
  function descriptionFor(field: string) { const ids = []; if (field === "message") ids.push(`${kind}-message-hint`); if (errors[field]) ids.push(`${kind}-${field}-error`); return ids.length ? ids.join(" ") : undefined; }
  if (status === "success") return <div className="form-success" tabIndex={-1} ref={successRef} role="status" aria-live="polite">
    <span className="success-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    <h4>{isSignup ? "You’re on the list." : "Your message is in."}</h4><p>{isSignup ? "Thank you for your interest in James Brown The Musical. Your signup has been received." : "Thank you for reaching out. Your message has been received by James Brown The Musical."}</p>
    <button type="button" onClick={() => { setStatus("idle"); setErrors({}); setNotice(""); requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("input:not([name=website])")?.focus()); }}>{isSignup ? "Add another email address" : "Send another message"}</button>
  </div>;
  return <form ref={formRef} onSubmit={submit} noValidate aria-label={isSignup ? "Sign up for more information" : "Contact James Brown The Musical"} aria-busy={status === "pending"}>
    <div className="honeypot" aria-hidden="true"><label htmlFor={`${kind}-website`}>Leave this field empty</label><input id={`${kind}-website`} name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <div className={isSignup ? "signup-fields" : "field-row"}>
      <div className="field"><label htmlFor={`${kind}-name`}>{isSignup ? "First name" : "Name"} {isSignup && <span>(optional)</span>}</label><input id={`${kind}-name`} name="name" type="text" autoComplete={isSignup ? "given-name" : "name"} placeholder={isSignup ? "Your first name" : "Your name"} maxLength={isSignup ? 80 : 120} required={!isSignup} aria-invalid={!!errors.name} aria-describedby={descriptionFor("name")} />{errorFor("name")}</div>
      <div className="field"><label htmlFor={`${kind}-email`}>Email address</label><input id={`${kind}-email`} name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength={254} required aria-invalid={!!errors.email} aria-describedby={descriptionFor("email")} />{errorFor("email")}</div>
    </div>
    {!isSignup && <><div className="field"><label htmlFor="contact-subject">What’s your message about?</label><select name="subject" id="contact-subject" defaultValue="General inquiry" aria-invalid={!!errors.subject} aria-describedby={descriptionFor("subject")}>{SUBJECTS.map(subject => <option key={subject} value={subject}>{subject}</option>)}</select>{errorFor("subject")}</div><div className="field"><label htmlFor="contact-message">Your message</label><textarea name="message" id="contact-message" placeholder="We’re listening…" rows={4} maxLength={5000} required aria-invalid={!!errors.message} aria-describedby={descriptionFor("message")} /><p className="field-hint" id="contact-message-hint">Up to 5,000 characters. All contact fields are required.</p>{errorFor("message")}</div></>}
    {isSignup && <div className="consent-wrapper"><label className="consent" htmlFor="signup-consent"><input id="signup-consent" type="checkbox" name="consent" required aria-invalid={!!errors.consent} aria-describedby={descriptionFor("consent")} /><span>{CONSENT_TEXT}</span></label>{errorFor("consent")}</div>}
    <button className="button button-gold submit-button" type="submit" disabled={status === "pending"}><span>{status === "pending" ? (isSignup ? "Signing you up…" : "Sending your message…") : (isSignup ? "Keep me updated" : "Send message")}</span><Arrow /></button>
    <p className="form-footnote">{isSignup ? "Your details will be used for updates about the musical." : "We’ll use your details to respond to this inquiry. This does not sign you up for marketing updates."}</p><p className="form-status" role="status" aria-live="polite">{notice}</p>
  </form>;
}
