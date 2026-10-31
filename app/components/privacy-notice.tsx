"use client";
import { useRef } from "react";

export function PrivacyNotice() {
  const ref = useRef<HTMLDialogElement>(null);
  return <>
    <button className="privacy-trigger" type="button" onClick={() => ref.current?.showModal()}>How We Use Your Information</button>
    <dialog className="privacy-dialog" ref={ref} aria-labelledby="privacy-heading" onClick={event => { if (event.target === ref.current) ref.current.close(); }}>
      <p className="eyebrow">Your information</p><h2 id="privacy-heading">A note about your details.</h2>
      <p><strong>When you sign up:</strong> we save your name, email address and consent so James Brown The Musical can share production updates with you.</p>
      <p><strong>When you contact us:</strong> we save your name, email address, inquiry topic and message so the production can respond. Sending a message does not add you to the updates list.</p>
      <p><strong>When you submit for auditions:</strong> we save your contact details, performance and production interests, headshot, résumé, and any experience or video link you provide for casting consideration and related follow-up. Audition submissions do not add you to the marketing updates list.</p>
      <p><strong>To request removal:</strong> use the <a href="/#contact" onClick={() => ref.current?.close()}>contact form</a> and include the email address you used. You can also use that form for questions about your information.</p>
      <p>The site uses temporary technical records to limit automated form submissions.</p>
      <button className="button button-gold" type="button" onClick={() => ref.current?.close()}>Close</button>
    </dialog>
  </>;
}
