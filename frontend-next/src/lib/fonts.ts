import { Bebas_Neue, DM_Sans, Space_Mono } from "next/font/google";

export const fontDisplay = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

// DM Sans on Google Fonts only ships latin / latin-ext — Cyrillic text falls
// back to the system stack. Revisit in Phase 6 if Bulgarian typography needs
// fixing (candidate: Manrope, Inter, or a different DM family weight).
export const fontBody = DM_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-body",
  display: "swap",
});

export const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});
