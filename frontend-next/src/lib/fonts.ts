import { Bebas_Neue, DM_Sans, Space_Mono } from "next/font/google";

export const fontDisplay = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const fontBody = DM_Sans({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const fontMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});
