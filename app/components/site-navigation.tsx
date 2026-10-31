"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./site-navigation.module.css";

export type ActiveSitePage = "auditions" | "creative-team";

const links = [
  { href: "/#the-musical", label: "The Musical" },
  { href: "/#productions", label: "Productions" },
  { href: "/creative-team", label: "Creative Team", page: "creative-team" },
  { href: "/auditions", label: "Auditions", page: "auditions" },
  { href: "/#contact", label: "Contact Us" },
] as const;

export function SiteNavigation({ active }: { active?: ActiveSitePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigationId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      setIsOpen(false);
      toggleRef.current?.focus();
    };
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);

  return (
    <div
      className={styles.navigation}
      ref={containerRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
    >
      <div className={styles.mobileControls}>
        <a className={styles.mobileUpdates} href="/#updates" onClick={closeMenu}>Get Updates</a>
        <button
          className={styles.menuToggle}
          type="button"
          ref={toggleRef}
          aria-expanded={isOpen}
          aria-controls={navigationId}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span>Menu</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d={isOpen ? "M5 5l10 10M15 5L5 15" : "M3 6h14M3 14h14"}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
      <nav
        className={styles.menu}
        id={navigationId}
        aria-label="Main navigation"
        data-open={isOpen}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            aria-current={"page" in link && active === link.page ? "page" : undefined}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
        <a className={styles.desktopUpdates} href="/#updates" onClick={closeMenu}>
          Get Updates
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </nav>
    </div>
  );
}
