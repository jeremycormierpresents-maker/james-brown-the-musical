import { PrivacyNotice } from "./privacy-notice";
import { SiteNavigation, type ActiveSitePage } from "./site-navigation";
import { SocialLinks } from "./social-links";

export function Arrow() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

export function Wordmark() {
  return <img className="brand-logo" src="/assets/james-brown-marquee.png" alt="" width="1536" height="1024" />;
}

export function SiteHeader({ active }: { active?: ActiveSitePage }) {
  return <>
    <a className="skip-link" href="#main">Skip to Content</a>
    <header className="site-header"><div className="nav-inner">
      <a href="/#home" className="brand" aria-label="James Brown The Musical — home"><Wordmark /></a>
      <SiteNavigation active={active} />
    </div></header>
  </>;
}

export function SiteFooter() {
  return <footer className="site-footer">
    <div className="footer-main section-shell">
      <a href="/#home" className="brand" aria-label="Back to James Brown The Musical"><Wordmark /></a>
      <p>The Godfather of Soul.<br /><span>The Legacy. The Sound. The Story.</span></p>
      <div className="footer-links"><a href="/creative-team">Creative Team</a><a href="/auditions">Auditions</a><a href="/#contact">Contact Us</a><a className="back-top" href="#main">Back to Top <span aria-hidden="true">↑</span></a></div>
    </div>
    <SocialLinks />
    <div className="footer-bottom section-shell"><p>© 2026 James Brown The Musical.</p><PrivacyNotice /></div>
  </footer>;
}
