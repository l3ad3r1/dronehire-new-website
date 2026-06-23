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
  title: "DroneHire — Book DGCA-Licensed Drone Pilots in Hyderabad",
  description:
    "Hire DGCA-licensed drone pilots in Hyderabad for real estate, weddings, construction, and agriculture. Book in minutes via WhatsApp. Pay after your shoot.",
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
