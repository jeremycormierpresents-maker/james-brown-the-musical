import styles from "./social-links.module.css";

const socialAccounts = [
  {
    platform: "Instagram",
    handle: "@jamesbrownthemusical",
    href: "https://www.instagram.com/jamesbrownthemusical/",
    icon: "instagram",
  },
  {
    platform: "Twitter / X",
    handle: "@JamesBrownBway",
    href: "https://x.com/JamesBrownBway",
    icon: "x",
  },
  {
    platform: "Facebook",
    handle: "/JamesBrownTheMusical",
    href: "https://www.facebook.com/JamesBrownTheMusical/",
    icon: "facebook",
  },
] as const;

function SocialIcon({ platform }: { platform: typeof socialAccounts[number]["icon"] }) {
  if (platform === "instagram") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
      </svg>
    );
  }

  if (platform === "x") {
    return (
      <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
        <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.59-6.64 7.59H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.29L17.61 20.65Z" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4V10H8v3h2.4v8h3.1Z" />
    </svg>
  );
}

export function SocialLinks() {
  return (
    <div id="social" className={`section-shell ${styles.social}`} role="navigation" aria-label="James Brown The Musical social media">
      <div className={styles.heading}>
        <p className={styles.title}>Follow the show</p>
        <p className={styles.notice}>Links open in a new tab.</p>
      </div>
      <ul className={styles.links}>
        {socialAccounts.map((account) => (
          <li key={account.icon}>
            <a
              className={styles.link}
              href={account.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${account.platform}: ${account.handle} (opens in a new tab)`}
            >
              <span className={styles.icon}><SocialIcon platform={account.icon} /></span>
              <span className={styles.account}>
                <span className={styles.platform}>{account.platform}</span>
                <span className={styles.handle}>{account.handle}</span>
              </span>
              <svg className={styles.external} width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M5 15 15 5M5 5h10v10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
