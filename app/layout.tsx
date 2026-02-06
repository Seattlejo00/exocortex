import type { Metadata } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Exocortex — Your entire digital self. One place.",
  description:
    "Exocortex unifies your digital identity across every platform. Connect your AI tools, email, and messages to build a single, living representation of you.",
  keywords: [
    "personal data",
    "digital identity",
    "AI context",
    "knowledge graph",
    "data aggregator",
  ],
  authors: [{ name: "Distomos LLC", url: "https://distomostech.com" }],
  openGraph: {
    title: "Exocortex — Your entire digital self. One place.",
    description:
      "Every AI knows a piece of you. Exocortex knows all of you. Unify your digital identity across every platform.",
    url: "https://exocortex.ai",
    siteName: "Exocortex",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exocortex — Your entire digital self. One place.",
    description:
      "Every AI knows a piece of you. Exocortex knows all of you. Unify your digital identity across every platform.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="font-body">{children}</body>
    </html>
  );
}
