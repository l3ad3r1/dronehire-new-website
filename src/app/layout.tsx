import type { Metadata } from "next";
import { Inter, Syncopate, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syncopate = Syncopate({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-syncopate",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dronehire-new-website.vercel.app"),
  title: "DroneHire — Book DGCA-Licensed Drone Pilots in Hyderabad",
  description:
    "Hire DGCA-licensed drone pilots in Hyderabad for real estate, weddings, construction, and events. Book in minutes via WhatsApp. Pay after your shoot.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dronehire-new-website.vercel.app",
    siteName: "DroneHire",
    title: "DroneHire — Book DGCA-Licensed Drone Pilots in Hyderabad",
    description:
      "Hire DGCA-licensed drone pilots in Hyderabad for real estate, weddings, construction, and events. Book in minutes via WhatsApp.",
    images: [
      {
        url: "/images/hero-cityscape.png",
        width: 1200,
        height: 630,
        alt: "DroneHire — Aerial drone photography over Hyderabad",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DroneHire — Book DGCA-Licensed Drone Pilots in Hyderabad",
    description:
      "Hire DGCA-licensed drone pilots in Hyderabad for real estate, weddings, construction, and events. Book in minutes via WhatsApp.",
    images: ["/images/hero-cityscape.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syncopate.variable} ${jetbrainsMono.variable}`}>
      <body suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
