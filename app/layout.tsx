import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://james-brown-the-musical.jcormierpres-0628.chatgpt.site"),
  title: "James Brown The Musical | Coming Soon",
  description: "The Godfather of Soul. The Legacy. The Sound. The Story. Sign up for James Brown The Musical news, announcements and future ticket information, or contact the production.",
  openGraph: { title: "James Brown The Musical | Coming Soon", description: "The Godfather of Soul. The Legacy. The Sound. The Story. Be first to know what’s next.", type: "website", images: [{ url: "/assets/james-brown-cover-updated.png", width: 1558, height: 1009, alt: "James Brown The Musical" }] },
  twitter: { card: "summary_large_image", title: "James Brown The Musical | Coming Soon", images: ["/assets/james-brown-cover-updated.png"] },
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
