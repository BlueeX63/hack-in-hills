import type { Metadata, Viewport } from "next";
import { Manrope, Syne, JetBrains_Mono, Anton, Cormorant_Garamond } from "next/font/google";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import CustomCursor from "@/components/custom-cursor";
import { Altimeter } from "@/components/altimeter";
import { FilmGrain } from "@/components/film-grain";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

// Bebas Neue removed as it was not widely used and replaced by Syne.

export const metadata: Metadata = {
  title: {
    default: "Hack in Hills | Manali",
    template: "%s | Hack in Hills",
  },
  description:
    "A premium hackathon experience in the Himalayas. Code at altitude — build where the air gets thin.",
  keywords: [
    "Hack in Hills",
    "Manali hackathon",
    "Himalayan hackathon",
    "hackathon India",
  ],
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Hack in Hills | Manali",
    description:
      "A premium hackathon experience in the Himalayas. Code at altitude — build where the air gets thin.",
    siteName: "Hack in Hills",
    images: ["/logo.png"],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Hack in Hills | Manali",
    description:
      "A premium hackathon experience in the Himalayas. Code at altitude — build where the air gets thin.",
    images: ["/logo.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${syne.variable} ${jetbrainsMono.variable} ${anton.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1A1A1A] text-foreground font-sans selection:bg-accent/30 selection:text-white relative overscroll-none">
        <FilmGrain />
        <Altimeter />
        <CustomCursor />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
