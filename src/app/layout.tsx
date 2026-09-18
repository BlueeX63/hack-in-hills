import type { Metadata, Viewport } from "next";
import { Manrope, Syne, JetBrains_Mono, Anton, Cormorant_Garamond } from "next/font/google";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { PerformanceProvider } from "@/hooks/use-performance";
import { AscentTrail } from "@/components/ascent-trail";
import { AscentAtmosphere } from "@/components/ascent-atmosphere";
import { ScrollJourneyProvider } from "@/hooks/use-scroll-journey";
import { FilmGrain } from "@/components/film-grain";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  weight: ["400"],
  style: ["italic"],
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
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
        <PerformanceProvider>
          <ScrollJourneyProvider>
            <AscentAtmosphere />
            <FilmGrain />
            <AscentTrail />
            <CustomCursor />
            <SmoothScrolling>{children}</SmoothScrolling>
          </ScrollJourneyProvider>
        </PerformanceProvider>
      </body>
    </html>
  );
}
