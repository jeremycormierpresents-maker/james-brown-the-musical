import { SubmissionForm } from "./components/submission-form";
import { Arrow, SiteHeader, SiteFooter } from "./components/site-chrome";
export default function Home() {
  return <>
    <SiteHeader />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-heading">
        <div className="hero-art"><img src="/assets/james-brown-cover-updated.png" alt="James Brown performing with a microphone, overlaid with the illuminated James Brown The Musical marquee logo." width="1558" height="1009" fetchPriority="high" /></div>
        <div className="hero-shade" aria-hidden="true" />
        <div className="hero-content"><h1 id="hero-heading"><span className="sr-only">James Brown The Musical — </span>Coming Soon</h1><div className="hero-actions"><a className="button button-gold" href="#updates">Be First to Know <Arrow /></a><a className="button button-outline" href="#contact">Contact Us <Arrow /></a></div></div>
      </section>
      <div className="legacy-strip" aria-label="The Godfather of Soul. The Legacy. The Sound. The Story."><span>The Godfather of Soul.</span><i aria-hidden="true">✦</i><span>The Legacy.</span><i aria-hidden="true">✦</i><span>The Sound.</span><i aria-hidden="true">✦</i><span>The Story.</span></div>
      <section className="intro section-shell" id="the-musical" aria-labelledby="intro-heading">
        <div><p className="eyebrow"><span /> The musical</p><h2 id="intro-heading">A legendary sound.<br /><em>A new stage.</em></h2></div>
        <div className="intro-copy"><p>A celebration of the music, the spirit and the extraordinary legacy of James Brown.</p><p>Follow the journey as <strong>James Brown The Musical</strong> comes to life. The next chapter is just beginning—and you’re invited.</p><div className="intro-links"><a className="text-link" href="/creative-team">Meet the Creative Team <Arrow /></a><a className="text-link" href="#updates">Stay Connected to the Story <Arrow /></a></div></div>
      </section>
      <section className="productions-section section-shell" id="productions" aria-labelledby="productions-heading">
        <div className="productions-heading"><div><p className="eyebrow"><span /> The journey ahead</p><h2 id="productions-heading">Three stages.<br /><em>One extraordinary legacy.</em></h2></div><p>From Atlanta to the road to Broadway.<br />Follow the next chapters of James Brown The Musical.</p></div>
        <div className="production-grid">
          <article className="production-card premiere-card"><div className="production-topline"><span>01</span><span>The opening chapter</span></div><h3><span>World Premiere:</span>Atlanta</h3><p>The story takes the stage in Atlanta. Be part of the journey to the world premiere.</p><span className="production-card-rule" aria-hidden="true" /></article>
          <article className="production-card tour-card"><div className="production-topline"><span>02</span><span>The road ahead</span></div><h3>National Tour</h3><p>The sound and spirit of James Brown, on the road. Follow along for future cities and tour announcements.</p><span className="production-card-rule" aria-hidden="true" /></article>
          <article className="production-card broadway-card"><div className="production-topline"><span>03</span><span>The next stage</span></div><h3>Broadway</h3><p>A legendary sound. A Broadway vision. Stay connected as the musical continues its development.</p><span className="production-card-rule" aria-hidden="true" /></article>
        </div>
        <div className="productions-follow"><p>Production news, future dates and announcements, as they happen.</p><a className="text-link" href="#updates">Get Production Updates <Arrow /></a></div>
      </section>
      <section className="auditions-callout" aria-labelledby="auditions-callout-heading"><div className="section-shell auditions-callout-inner"><div><p className="eyebrow"><span /> Audition submissions</p><h2 id="auditions-callout-heading">Bring your talent<br /><em>to the stage.</em></h2><p>Actors. Singers. Dancers. Musicians.<br />Introduce yourself and share your materials for casting consideration.</p></div><a className="button button-gold" href="/auditions">Submit for Auditions <Arrow /></a></div></section>
      <section className="updates-section" id="updates" aria-labelledby="updates-heading"><div className="section-shell form-section">
        <div className="section-copy"><p className="eyebrow"><span /> More information</p><h2 id="updates-heading">You’ll want<br />to <em>hear this.</em></h2><p>Get the latest news, production announcements and future ticket information from James Brown The Musical.</p><div className="update-details" aria-label="Updates include"><span>Show news</span><span>Ticket announcements</span><span>What’s next</span></div></div>
        <div className="form-panel signup-panel"><p className="form-kicker">The next chapter starts here</p><h3>Stay in the know.</h3><p className="form-description">Sign up for more information.</p><SubmissionForm kind="signup" /></div>
      </div></section>
      <section className="contact-section section-shell form-section" id="contact" aria-labelledby="contact-heading">
        <div className="section-copy"><p className="eyebrow"><span /> Contact us</p><h2 id="contact-heading">Let’s start<br /><em>a conversation.</em></h2><p>Have a question about the musical? Interested in press, partnerships or working together? We’d love to hear from you.</p><div className="contact-note"><span className="note-line" aria-hidden="true" /><p>For announcements and ticket news,<br /><a href="#updates">join our updates list <span aria-hidden="true">↗</span></a></p></div></div>
        <div className="form-panel contact-panel"><h3>Send us a message.</h3><p className="form-description">Tell us how we can help.</p><SubmissionForm kind="contact" /></div>
      </section>
    </main>
    <SiteFooter />
  </>;
}
