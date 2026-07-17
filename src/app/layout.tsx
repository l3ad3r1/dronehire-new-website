import type { Metadata } from "next";
import { Inter, Syncopate, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { EMAIL } from "@/lib/content";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const LOCAL_BUSINESS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "DroneHire",
  description:
    "Hire DGCA-licensed drone pilots in Hyderabad for real estate, weddings, construction, and events. Book in minutes via WhatsApp. Pay after your shoot.",
  url: SITE_URL,
  image: `${SITE_URL}/images/hero-cityscape.png`,
  telephone: "+91 9645179861",
  email: EMAIL,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 17.385,
    longitude: 78.4867,
  },
  areaServed: "Hyderabad",
  priceRange: "₹₹",
};

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
  metadataBase: new URL(SITE_URL),
  title: "DroneHire — Book DGCA-Licensed Drone Pilots in Hyderabad",
  description:
    "Hire DGCA-licensed drone pilots in Hyderabad for real estate, weddings, construction, and events. Book in minutes via WhatsApp. Pay after your shoot.",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
