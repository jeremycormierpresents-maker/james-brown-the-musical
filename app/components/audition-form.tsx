"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  AUDITION_CONSENT_TEXT,
  DISCIPLINES,
  PRODUCTIONS,
  validateAudition,
  validateAuditionFile,
} from "../../lib/audition-validation";
import styles from "./audition-form.module.css";

type Errors = Record<string, string>;
type UploadKind = "headshot" | "resume";
type SubmissionResult = { ok?: boolean; reference?: string; message?: string; errors?: Errors };

function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function FileIcon() {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /><path d="M14 3v6h6M12 17v-5m0 0-2 2m2-2 2 2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function createSubmissionId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, value => value.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function asFile(value: FormDataEntryValue | null): File | null {
  return value instanceof File && value.size > 0 ? value : null;
}

export function AuditionForm() {
  const [status, setStatus] = useState<"idle" | "pending" | "error" | "success">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [notice, setNotice] = useState("");
  const [reference, setReference] = useState("");
  const [fileNames, setFileNames] = useState<Record<UploadKind, string>>({ headshot: "", resume: "" });
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pending = useRef(false);
  const attempt = useRef<{ id: string; fingerprint: string } | null>(null);
  const isPending = status === "pending";

  useEffect(() => { if (status === "success") successRef.current?.focus(); }, [status]);

  function focusError(fieldErrors: Errors) {
    requestAnimationFrame(() => {
      const controls = Array.from(formRef.current?.elements ?? []);
      for (const name of Object.keys(fieldErrors)) {
        const control = controls.find(element => element.getAttribute("name") === name);
        if (control instanceof HTMLElement && !(control instanceof HTMLFieldSetElement)) { control.focus(); return; }
      }
      formRef.current?.querySelector<HTMLElement>("[role='alert']")?.focus();
    });
  }

  function clearError(field: string) {
    setErrors(previous => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>, kind: UploadKind) {
    const file = event.currentTarget.files?.[0] ?? null;
    setFileNames(previous => ({ ...previous, [kind]: file?.name ?? "" }));
    const error = validateAuditionFile(file, kind);
    setErrors(previous => {
      const next = { ...previous };
      if (error) next[kind] = error;
      else delete next[kind];
      return next;
    });
  }

  function removeFile(kind: UploadKind) {
    const input = formRef.current?.elements.namedItem(kind);
    if (input instanceof HTMLInputElement) { input.value = ""; input.focus(); }
    setFileNames(previous => ({ ...previous, [kind]: "" }));
    clearError(kind);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending.current) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const headshot = asFile(fields.get("headshot"));
    const resume = asFile(fields.get("resume"));
    const values = {
      firstName: fields.get("firstName") ?? "",
      middleName: fields.get("middleName") ?? "",
      lastName: fields.get("lastName") ?? "",
      email: fields.get("email") ?? "",
      phone: fields.get("phone") ?? "",
      city: fields.get("city") ?? "",
      state: fields.get("state") ?? "",
      country: fields.get("country") ?? "",
      disciplines: fields.getAll("disciplines"),
      productions: fields.getAll("productions"),
      experience: fields.get("experience") ?? "",
      videoUrl: fields.get("videoUrl") ?? "",
      consent: fields.get("consent") === "on",
      website: fields.get("website") ?? "",
    };
    const fileSignature = (file: File | null) => file ? { name: file.name, size: file.size, type: file.type, modified: file.lastModified } : null;
    const fingerprint = JSON.stringify({ values, headshot: fileSignature(headshot), resume: fileSignature(resume) });
    if (!attempt.current || attempt.current.fingerprint !== fingerprint) attempt.current = { id: createSubmissionId(), fingerprint };
    const submissionId = attempt.current.id;
    const checked = validateAudition({ ...values, submissionId });
    const fieldErrors = { ...checked.errors };
    const headshotError = validateAuditionFile(headshot, "headshot");
    const resumeError = validateAuditionFile(resume, "resume");
    if (headshotError) fieldErrors.headshot = headshotError;
    if (resumeError) fieldErrors.resume = resumeError;
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      setStatus("error"); setNotice("Please check the highlighted fields before submitting."); focusError(fieldErrors); return;
    }
    fields.set("submissionId", submissionId);
    pending.current = true;
    setStatus("pending");
    setNotice("");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch("/api/auditions", { method: "POST", body: fields, signal: controller.signal });
      const result = await response.json().catch(() => null) as SubmissionResult | null;
      if (!response.ok || !result?.ok) {
        const returnedErrors = result?.errors ?? {};
        setErrors(returnedErrors);
        setStatus("error");
        setNotice(result?.message ?? "We couldn’t save your submission. Your details and files are still here—please try again.");
        if (response.status === 409) attempt.current = null;
        focusError(returnedErrors);
        return;
      }
      setReference(result.reference ?? submissionId);
      form.reset();
      setFileNames({ headshot: "", resume: "" });
      attempt.current = null;
      setStatus("success");
    } catch {
      setStatus("error");
      setNotice("We couldn’t confirm your submission. Your details and files are still here. Check your connection, then try again.");
    } finally {
      clearTimeout(timeout);
      pending.current = false;
    }
  }

  function errorFor(field: string) {
    return errors[field] ? <p className="field-error" id={`audition-${field}-error`}>{errors[field]}</p> : null;
  }

  function describedBy(field: string, hint = false) {
    return [hint ? `audition-${field}-hint` : "", errors[field] ? `audition-${field}-error` : ""].filter(Boolean).join(" ") || undefined;
  }

  function startAgain() {
    attempt.current = null;
    setStatus("idle"); setErrors({}); setNotice(""); setReference("");
    requestAnimationFrame(() => formRef.current?.querySelector<HTMLInputElement>("input[name='firstName']")?.focus());
  }

  if (status === "success") return <div className={styles.success} tabIndex={-1} ref={successRef} role="status" aria-live="polite">
    <span className="success-icon" aria-hidden="true"><svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
    <p className={styles.successEyebrow}>Submission received</p>
    <h3>Your next chapter<br />starts with a hello.</h3>
    <p>Thank you for your interest in James Brown The Musical. Your audition submission and materials have been saved for casting consideration.</p>
    <div className={styles.reference}><span>Keep your submission reference</span><code>{reference}</code></div>
    <p>The production team can use your contact details to follow up about your submission.</p>
    <button className="button button-outline" type="button" onClick={startAgain}>Submit Another Application <Arrow /></button>
  </div>;

  return <form className={styles.form} ref={formRef} onSubmit={submit} method="post" action="/api/auditions" encType="multipart/form-data" noValidate aria-label="Audition submission" aria-busy={isPending}>
    <p className={styles.requiredNote}>Fields marked <span aria-hidden="true">*</span> are required.</p>
    <div className="honeypot" aria-hidden="true"><label htmlFor="audition-website">Leave this field empty</label><input id="audition-website" name="website" type="text" tabIndex={-1} autoComplete="off" /></div>
    <fieldset className={styles.controls} disabled={isPending}>
      <section className={styles.section} aria-labelledby="audition-about-heading">
        <div className={styles.sectionHeading}><span aria-hidden="true">01</span><h3 id="audition-about-heading">About you</h3></div>
        <div className={styles.tripleGrid}>
          <div className="field"><label htmlFor="audition-firstName">First Name <span className={styles.required} aria-hidden="true">*</span></label><input id="audition-firstName" name="firstName" type="text" autoComplete="given-name" placeholder="First name" maxLength={60} required aria-invalid={!!errors.firstName} aria-describedby={describedBy("firstName")} onChange={() => clearError("firstName")} />{errorFor("firstName")}</div>
          <div className="field"><label htmlFor="audition-middleName">Middle Name <span>(optional)</span></label><input id="audition-middleName" name="middleName" type="text" autoComplete="additional-name" placeholder="Middle name" maxLength={60} aria-invalid={!!errors.middleName} aria-describedby={describedBy("middleName")} onChange={() => clearError("middleName")} />{errorFor("middleName")}</div>
          <div className="field"><label htmlFor="audition-lastName">Last Name <span className={styles.required} aria-hidden="true">*</span></label><input id="audition-lastName" name="lastName" type="text" autoComplete="family-name" placeholder="Last name" maxLength={60} required aria-invalid={!!errors.lastName} aria-describedby={describedBy("lastName")} onChange={() => clearError("lastName")} />{errorFor("lastName")}</div>
        </div>
        <div className={styles.fieldGrid}>
          <div className="field"><label htmlFor="audition-email">Email Address <span className={styles.required} aria-hidden="true">*</span></label><input id="audition-email" name="email" type="email" autoComplete="email" inputMode="email" placeholder="you@example.com" maxLength={254} required aria-invalid={!!errors.email} aria-describedby={describedBy("email")} onChange={() => clearError("email")} />{errorFor("email")}</div>
          <div className="field"><label htmlFor="audition-phone">Phone Number <span>(optional)</span></label><input id="audition-phone" name="phone" type="tel" autoComplete="tel" placeholder="Include your country code" maxLength={40} aria-invalid={!!errors.phone} aria-describedby={describedBy("phone")} onChange={() => clearError("phone")} />{errorFor("phone")}</div>
        </div>
        <div className={styles.tripleGrid}>
          <div className="field"><label htmlFor="audition-city">City <span className={styles.required} aria-hidden="true">*</span></label><input id="audition-city" name="city" type="text" autoComplete="address-level2" placeholder="City" maxLength={80} required aria-invalid={!!errors.city} aria-describedby={describedBy("city")} onChange={() => clearError("city")} />{errorFor("city")}</div>
          <div className="field"><label htmlFor="audition-state">State / Province <span>(optional)</span></label><input id="audition-state" name="state" type="text" autoComplete="address-level1" placeholder="State or province" maxLength={80} aria-invalid={!!errors.state} aria-describedby={describedBy("state")} onChange={() => clearError("state")} />{errorFor("state")}</div>
          <div className="field"><label htmlFor="audition-country">Country <span className={styles.required} aria-hidden="true">*</span></label><input id="audition-country" name="country" type="text" autoComplete="country-name" placeholder="Country" maxLength={80} required aria-invalid={!!errors.country} aria-describedby={describedBy("country")} onChange={() => clearError("country")} />{errorFor("country")}</div>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="audition-performance-heading">
        <div className={styles.sectionHeading}><span aria-hidden="true">02</span><h3 id="audition-performance-heading">Your performance</h3></div>
        <fieldset className={styles.choiceGroup} aria-describedby={describedBy("disciplines", true)} aria-invalid={!!errors.disciplines}>
          <legend>How Do You Perform? <span className={styles.required} aria-hidden="true">*</span></legend>
          <p className={styles.groupHint} id="audition-disciplines-hint">Select all that apply.</p>
          <div className={styles.disciplines}>{DISCIPLINES.map(item => <label className={styles.choice} key={item.value} htmlFor={`audition-discipline-${item.value}`}><input id={`audition-discipline-${item.value}`} type="checkbox" name="disciplines" value={item.value} aria-invalid={!!errors.disciplines} aria-describedby={describedBy("disciplines", true)} onChange={() => clearError("disciplines")} /><span>{item.label}</span></label>)}</div>
          {errorFor("disciplines")}
        </fieldset>
        <fieldset className={styles.choiceGroup} aria-describedby={describedBy("productions", true)} aria-invalid={!!errors.productions}>
          <legend>Which Productions Interest You? <span className={styles.required} aria-hidden="true">*</span></legend>
          <p className={styles.groupHint} id="audition-productions-hint">You can select more than one.</p>
          <div className={styles.productions}>{PRODUCTIONS.map(item => <label className={styles.choice} key={item.value} htmlFor={`audition-production-${item.value}`}><input id={`audition-production-${item.value}`} type="checkbox" name="productions" value={item.value} aria-invalid={!!errors.productions} aria-describedby={describedBy("productions", true)} onChange={() => clearError("productions")} /><span>{item.label}</span></label>)}</div>
          {errorFor("productions")}
        </fieldset>
        <div className="field"><label htmlFor="audition-experience">Experience &amp; Special Skills <span>(optional)</span></label><textarea id="audition-experience" name="experience" rows={4} maxLength={3000} placeholder="Tell us about your training, stage experience, vocal range, dance styles or instruments you play." aria-invalid={!!errors.experience} aria-describedby={describedBy("experience", true)} onChange={() => clearError("experience")} /><p className="field-hint" id="audition-experience-hint">Up to 3,000 characters.</p>{errorFor("experience")}</div>
      </section>

      <section className={styles.section} aria-labelledby="audition-materials-heading">
        <div className={styles.sectionHeading}><span aria-hidden="true">03</span><h3 id="audition-materials-heading">Your materials</h3></div>
        <div className={styles.uploadGrid}>
          <div className={styles.upload}>
            <div className={styles.uploadHeading}><FileIcon /><label htmlFor="audition-headshot">Headshot <span className={styles.required} aria-hidden="true">*</span></label></div>
            <p className={styles.uploadHint} id="audition-headshot-hint">JPG, PNG or WebP. Maximum 5 MB.</p>
            <input className={styles.fileInput} id="audition-headshot" name="headshot" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" required aria-invalid={!!errors.headshot} aria-describedby={describedBy("headshot", true)} onChange={event => handleFile(event, "headshot")} />
            {fileNames.headshot && <div className={styles.selectedFile}><span title={fileNames.headshot}>{fileNames.headshot}</span><button type="button" onClick={() => removeFile("headshot")} aria-label="Remove selected headshot">Remove</button></div>}
            {errorFor("headshot")}
          </div>
          <div className={styles.upload}>
            <div className={styles.uploadHeading}><FileIcon /><label htmlFor="audition-resume">Résumé <span className={styles.required} aria-hidden="true">*</span></label></div>
            <p className={styles.uploadHint} id="audition-resume-hint">PDF only. Maximum 5 MB.</p>
            <input className={styles.fileInput} id="audition-resume" name="resume" type="file" accept="application/pdf,.pdf" required aria-invalid={!!errors.resume} aria-describedby={describedBy("resume", true)} onChange={event => handleFile(event, "resume")} />
            {fileNames.resume && <div className={styles.selectedFile}><span title={fileNames.resume}>{fileNames.resume}</span><button type="button" onClick={() => removeFile("resume")} aria-label="Remove selected résumé">Remove</button></div>}
            {errorFor("resume")}
          </div>
        </div>
        <div className="field"><label htmlFor="audition-videoUrl">Audition Video or Performance Reel <span>(optional)</span></label><input id="audition-videoUrl" name="videoUrl" type="url" inputMode="url" autoComplete="url" placeholder="https://…" maxLength={2048} aria-invalid={!!errors.videoUrl} aria-describedby={describedBy("videoUrl", true)} onChange={() => clearError("videoUrl")} /><p className="field-hint" id="audition-videoUrl-hint">Share a video link the casting team can open without requesting access.</p>{errorFor("videoUrl")}</div>
      </section>

      <div className={styles.submitArea}>
        <div className="consent-wrapper"><label className="consent" htmlFor="audition-consent"><input id="audition-consent" name="consent" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={describedBy("consent")} onChange={() => clearError("consent")} /><span>{AUDITION_CONSENT_TEXT}</span></label>{errorFor("consent")}</div>
        <button className="button button-gold submit-button" type="submit" disabled={isPending}><span>{isPending ? "Uploading & Submitting…" : "Submit for Consideration"}</span>{isPending ? <span className={styles.spinner} aria-hidden="true" /> : <Arrow />}</button>
        <p className="form-footnote">Your details and materials are used for casting consideration. This submission does not add you to the marketing updates list.</p>
      </div>
    </fieldset>
    <div className={styles.notice} role={status === "error" ? "alert" : "status"} aria-live={status === "error" ? "assertive" : "polite"} tabIndex={-1}>{isPending ? "Your materials are being uploaded. Please keep this page open until you see the confirmation." : notice}</div>
  </form>;
}
