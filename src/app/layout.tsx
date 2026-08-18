import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono, Anton, Bebas_Neue } from "next/font/google";
import { SmoothScrolling } from "@/components/smooth-scrolling";
import CustomCursor from "@/components/custom-cursor";
import { Altimeter } from "@/components/altimeter";
import { FilmGrain } from "@/components/film-grain";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
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

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Hack in Hills | Manali",
  description: "An expedition into technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${anton.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#1A1A1A] text-foreground font-sans selection:bg-accent/30 selection:text-white relative">
        <FilmGrain />
        <Altimeter />
        <CustomCursor />
        <SmoothScrolling>{children}</SmoothScrolling>
      </body>
    </html>
  );
}
