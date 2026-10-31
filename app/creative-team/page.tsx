import type { Metadata } from "next";
import { Arrow, SiteFooter, SiteHeader } from "../components/site-chrome";
import styles from "./creative-team.module.css";

const description = "Meet the creative team behind James Brown The Musical — Deanna Brown-Thomas, Co-Writer & Lead Producer, and Jeremy E. Cormier, Co-Writer, Director & Lead Producer.";

export const metadata: Metadata = {
  title: "Creative Team | James Brown The Musical",
  description,
  openGraph: {
    title: "Creative Team | James Brown The Musical",
    description,
    type: "website",
    images: [{ url: "/assets/james-brown-cover-updated.png", width: 1558, height: 1009, alt: "James Brown The Musical" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Creative Team | James Brown The Musical",
    description,
    images: ["/assets/james-brown-cover-updated.png"],
  },
};

export default function CreativeTeamPage() {
  return (
    <>
      <SiteHeader active="creative-team" />
      <main id="main">
        <section className={styles.hero} aria-labelledby="creative-team-heading">
          <div className={`section-shell ${styles.heroInner}`}>
            <nav className={styles.breadcrumb} aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">Creative Team</span>
            </nav>
            <div className={styles.heroGrid}>
              <div>
                <p className="eyebrow"><span aria-hidden="true" /> Behind the musical</p>
                <h1 id="creative-team-heading">Creative<br /><em>Team.</em></h1>
              </div>
              <div className={styles.heroDetails}>
                <p className={styles.intro}>The family-authorized voices shaping James Brown’s story for the stage.</p>
                <div className={styles.memberLinks} role="navigation" aria-label="Meet the creative team">
                  <a href="#deanna-brown-thomas">
                    <span className={styles.linkNumber} aria-hidden="true">01</span>
                    <span>Deanna Brown-Thomas</span>
                    <Arrow />
                  </a>
                  <a href="#jeremy-e-cormier">
                    <span className={styles.linkNumber} aria-hidden="true">02</span>
                    <span>Jeremy E. Cormier</span>
                    <Arrow />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className={`section-shell ${styles.profiles}`}>
          <article className={styles.profile} id="deanna-brown-thomas" aria-labelledby="deanna-name">
            <header className={styles.profileHeading}>
              <span className={styles.profileNumber} aria-hidden="true">01</span>
              <p className={styles.role}>Co-Writer &amp; Lead Producer</p>
              <h2 id="deanna-name">Deanna Brown-Thomas</h2>
              <span className={styles.nameRule} aria-hidden="true" />
              <img className={styles.portrait} src="/assets/deanna-brown-thomas.png" alt="Portrait of Deanna Brown-Thomas" width="800" height="800" loading="lazy" decoding="async" />
            </header>
            <div className={styles.bio}>
              <p>
                Dr. Deanna Brown-Thomas is a music and media luminary, humanitarian, and entrepreneur — and the
                daughter of the legendary Godfather of Soul, James Brown. She is the President of The James Brown
                Family Foundation (JBFF), a 501(c)(3) non-profit established in accordance with Mr. Brown’s wishes,
                through which she leads the Annual James Brown Turkey and Toy Giveaways in Augusta, Georgia, and
                serves as Ambassador for Feed the Hungry.
              </p>
              <p>
                In 2011 she founded The James Brown Academy of Musik Pupils (JAMP), a year-round musical “village”
                nurturing young talent through instrumental training, music theory, and original production. In 2016
                she launched The James Brown Family Historical Tour in Augusta. Her entrepreneurial portfolio includes
                Deanna Inc., parent company of T&amp;T Transportation, DeShawn’s Seafood, and Val-U Furniture.
              </p>
              <p>
                Her industry credentials are deep and lived. As Executive Vice-President of James Brown Enterprises,
                she worked side-by-side with her father; she consulted on the world premiere of the biopic{" "}
                <em>Get On Up</em>, consulted on the HBO documentary <em>The Rise of James Brown</em>, and produced
                the A&amp;E documentary <em>Say It Loud</em>. A SAG film actress (<em>New York Undercover</em>,{" "}
                <em>Blues Brothers 2000</em>), she holds a bachelor’s degree from Towson State University and an
                FCC License from Columbia School of Broadcasting, with a broadcasting career spanning Radio-One,
                Clear Channel, Brown Broadcasting, and WRDW TV (CBS affiliate Augusta). A Life Member of Alpha Kappa
                Alpha Sorority Inc., she serves on the board of the Augusta Museum of History, where she spearheaded
                the largest exhibit of James Brown memorabilia in existence. She holds an honorary Doctorate in
                Christian Humanitarian from The School of The Great Commission Bible College and Seminary.
              </p>
            </div>
          </article>

          <article className={styles.profile} id="jeremy-e-cormier" aria-labelledby="jeremy-name">
            <header className={styles.profileHeading}>
              <span className={styles.profileNumber} aria-hidden="true">02</span>
              <p className={styles.role}>Co-Writer, Director &amp; Lead Producer</p>
              <h2 id="jeremy-name">Jeremy E. Cormier</h2>
              <span className={styles.nameRule} aria-hidden="true" />
              <img className={styles.portrait} src="/assets/jeremy-e-cormier.png" alt="Portrait of Jeremy E. Cormier" width="682" height="1024" loading="lazy" decoding="async" />
            </header>
            <div className={styles.bio}>
              <p>
                Jeremy E. Cormier is the Director, Co-Book Writer, and Lead Producer of{" "}
                <strong>James Brown The Musical</strong> — a production he has spent the last few years developing
                alongside Deanna Brown-Thomas. As a board member of the James Brown Family Foundation, his
                connection to this story runs deeper than any creative brief or development deal: it is built on
                years of trust, cultural stewardship, and shared purpose.
              </p>
              <p>
                A graduate of Morehouse College (BA, Business Administration) and South University (MBA), Cormier
                spent a decade as a Financial Analyst managing a $1.8 billion portfolio for the Georgia Environmental
                Finance Authority before channeling that same rigor into entertainment production — a crossover that
                shapes his directing in measurable ways. He arrives at the creative process fluent in both artistic
                vision and executive discipline, equally at home in a design presentation and a budget review.
              </p>
              <p>
                His regional theater producing credits span some of the most celebrated works in the Black American
                theatrical canon. Through Dominion Entertainment Group, he served as Company Manager and Associate
                Producer on productions including <em>Dreamgirls</em>, <em>A Raisin in the Sun</em>,{" "}
                <em>Black Nativity</em>, <em>Mahalia</em>, <em>Crowns</em>, and <em>Chicken &amp; Biscuits</em>. As
                Business Manager at Dynamite Productions, he built additional fluency in musical theater operations
                across <em>Motown Revue</em>, <em>Cotton Club</em>, <em>A Soulful Christmas</em>, and{" "}
                <em>Cindy The Musical</em>.
              </p>
              <p>
                As CEO and Executive Producer of Jeremy Cormier Presents LLC since 2015, he has directed and produced
                original musicals including <em>It’s A New Day</em> and <em>Even A Good Man Is Tempted</em>, alongside
                major live events for artists, civic organizations, and cultural institutions across Atlanta. His
                large-scale touring credits include serving as Production Coordinator for Janet Jackson’s Together
                Again Tour, the Essence Music Festival, and the Cincinnati Music Festival.
              </p>
              <p>
                His relationship with James Brown’s legacy reaches back to 2007. Cormier serves on the boards of the
                James Brown Family Foundation and the Dominion Arts Foundation.
              </p>
            </div>
          </article>
        </div>

        <section className={styles.nextChapter} aria-labelledby="next-chapter-heading">
          <div className={`section-shell ${styles.nextInner}`}>
            <div>
              <p className="eyebrow"><span aria-hidden="true" /> The story continues</p>
              <h2 id="next-chapter-heading">Be part of<br /><em>the next chapter.</em></h2>
              <p className={styles.nextCopy}>Follow the musical’s journey, or share your talent for casting consideration.</p>
            </div>
            <div className={styles.nextActions}>
              <a className="button button-gold" href="/#updates">Get Production Updates <Arrow /></a>
              <a className="text-link" href="/auditions">Submit for Auditions <Arrow /></a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
