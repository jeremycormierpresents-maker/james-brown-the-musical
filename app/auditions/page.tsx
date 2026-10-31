import type { Metadata } from "next";
import { AuditionForm } from "../components/audition-form";
import { Arrow, SiteFooter, SiteHeader } from "../components/site-chrome";

export const metadata: Metadata = {
  title: "Audition Submissions | James Brown The Musical",
  description: "Submit your headshot, résumé and performance materials for casting consideration for James Brown The Musical. World Premiere: Atlanta, National Tour and Broadway.",
  openGraph: { title: "Audition Submissions | James Brown The Musical", description: "Actors. Singers. Dancers. Musicians. Share your talent with James Brown The Musical.", images: [{ url: "/assets/james-brown-cover-updated.png", width: 1558, height: 1009, alt: "James Brown The Musical" }] },
};

export default function AuditionsPage() {
  return <><SiteHeader active="auditions" /><main id="main">
    <section className="audition-hero" aria-labelledby="audition-heading"><div className="section-shell audition-hero-inner">
      <div><a className="breadcrumb-link" href="/">Home <span aria-hidden="true">/</span> <span>Auditions</span></a><p className="eyebrow"><span /> Your next chapter</p><h1 id="audition-heading">Audition<br /><em>submissions.</em></h1><p className="audition-hero-copy">Actors. Singers. Dancers. Musicians.<br />Bring your talent to the story of James Brown.</p><a className="text-link" href="#audition-form">Start Your Submission <Arrow /></a></div>
      <div className="audition-hero-brand"><img src="/assets/james-brown-marquee.png" alt="James Brown The Musical" width="1536" height="1024" /><p>The Godfather of Soul.<br /><span>The Legacy. The Sound. The Story.</span></p></div>
    </div></section>
    <div className="audition-stages" aria-label="Production interests"><span>World Premiere: Atlanta</span><i aria-hidden="true">✦</i><span>National Tour</span><i aria-hidden="true">✦</i><span>Broadway</span></div>
    <section className="section-shell audition-layout" aria-labelledby="submission-heading">
      <aside className="audition-guide"><p className="eyebrow"><span /> A little preparation</p><h2>Ready for<br /><em>your moment?</em></h2><p>Tell us about yourself and share the materials that show what you do.</p>
        <ol className="materials-checklist"><li><span>01</span><div><h3>A recent headshot</h3><p>JPG, PNG or WebP. Up to 5 MB.</p></div></li><li><span>02</span><div><h3>Your résumé</h3><p>A PDF of your performance experience. Up to 5 MB.</p></div></li><li><span>03</span><div><h3>A video link <small>(optional)</small></h3><p>Share a reel or audition video. Make sure the production team can open the link.</p></div></li></ol>
        <div className="audition-next"><h3>After you submit</h3><p>You’ll see a confirmation and a reference number. Your materials are saved for casting consideration, and the production can use your contact details to follow up.</p><p>Submission is for consideration; audition appointments are arranged separately.</p></div>
        <a className="text-link" href="/#contact">A Question Before You Start? <Arrow /></a>
      </aside>
      <div className="form-panel audition-panel" id="audition-form"><p className="form-kicker">James Brown The Musical</p><h2 id="submission-heading">Let’s get to know you.</h2><p className="form-description">Complete the required fields and share your materials.</p><AuditionForm /></div>
    </section>
  </main><SiteFooter /></>;
}
