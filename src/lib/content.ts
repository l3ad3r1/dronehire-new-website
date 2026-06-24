// All verbatim content extracted from https://dronehire.base44.app/
import type {
  NavLink,
  ProcessStep,
  StatItem,
  Service,
  TrustPoint,
  PricingTier,
  Guarantee,
  FaqItem,
  FooterColumn,
} from "@/types";

export const WHATSAPP_URL = "https://wa.me/919645179861";
export const EMAIL = "hello@dronehire.in";
export const COORDINATES = "17.3850° N, 78.4867° E";

export const NAV_LINKS: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Pilot network", href: "/pilots" },
];

export const SHOOT_TYPES = ["Real estate", "Weddings", "Construction", "Events"];

export const HERO_TAGS = [
  { emoji: "🏢", label: "Real estate" },
  { emoji: "💍", label: "Weddings" },
  { emoji: "🏗️", label: "Construction" },
  { emoji: "🎉", label: "Events" },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Tell us what you need",
    description:
      "Message us on WhatsApp — shoot type, date, and area in Hyderabad. Takes under two minutes.",
  },
  {
    number: "02",
    title: "We match you a pilot",
    description:
      "We assign a verified, DGCA-licensed pilot near your location. Confirmation lands in a few hours — no calls, no hunting.",
  },
  {
    number: "03",
    title: "Receive your footage",
    description:
      "Edited aerial photos and 4K video delivered within 48 hours. The 50% balance is due only after you approve the watermarked preview.",
  },
];

export const STATS: StatItem[] = [
  { value: "DGCA", description: "Every pilot is certified and legally cleared to fly" },
  { value: "48h", description: "Edited footage delivered after your shoot" },
  { value: "50/50", description: "50% to book your pilot — balance after you approve the preview" },
  { value: "4K", description: "Cinema-grade footage as standard" },
];

export const SERVICES: Service[] = [
  {
    index: "SERVICE_01",
    title: "Real estate",
    description:
      "From high-rises in Gachibowli to villas in Jubilee Hills — aerial shots that make listings sell faster. Built for Hyderabad's fast-moving property market.",
    image: "/images/service-real-estate.png",
    imageAlt: "Real estate aerial photography",
    ctaLabel: "BOOK A DRONE NOW →",
    whatsappMessage:
      "Hi, I'd like to book a drone shoot for real estate in Hyderabad. Please share available dates and pricing.",
  },
  {
    index: "SERVICE_02",
    title: "Weddings & events",
    description:
      "Cinematic aerial coverage — function halls in Kondapur, farmhouses near Shamirpet, rooftops in Banjara Hills. Your guests will ask who did the aerial shots.",
    image: "/images/service-weddings.png",
    imageAlt: "Weddings & events aerial photography",
    ctaLabel: "BOOK A DRONE NOW →",
    whatsappMessage:
      "Hi, I'd like to book aerial coverage for my wedding / event in Hyderabad. Please share available dates and pricing.",
  },
  {
    index: "SERVICE_03",
    title: "Corporate & events",
    description:
      "Product launches, campus flyovers, open-air concerts — if it happens in Hyderabad and needs a bird's-eye view, we've got a licensed pilot for it.",
    image: "/images/service-corporate.png",
    imageAlt: "Corporate & events aerial photography",
    ctaLabel: "BOOK A DRONE NOW →",
    whatsappMessage:
      "Hi, I'd like to book aerial coverage for a corporate event in Hyderabad. Please share available dates and pricing.",
  },
  {
    index: "SERVICE_04",
    title: "Construction & infra",
    description:
      "Weekly progress documentation, orthomosaic mapping, and stakeholder-ready reports for sites across the Outer Ring Road and HMDA zones.",
    image: "/images/service-construction.png",
    imageAlt: "Construction & infra aerial photography",
    ctaLabel: "BOOK A DRONE NOW →",
    whatsappMessage:
      "Hi, I'd like to book drone surveys for a construction / infra project in Hyderabad. Please share your recurring survey plans and pricing.",
  },
];

export const WHY_INTRO =
  "Most drone shoots in Hyderabad fail for three reasons: an unlicensed operator, a police stop mid-flight, or shaky phone-sensor footage. DroneHire eliminates all three — before your shoot even starts.";

export const WHY_POINTS: TrustPoint[] = [
  { title: "Zero police shutdowns", description: "We pull automated digital red-zone clearances before every flight so your shoot isn't paused by local authorities mid-session." },
  { title: "No rogue flyaways", description: "Enterprise DJI hardware calibrated weekly, backed by ₹1 Cr third-party liability coverage — not a hobbyist drone from Amazon." },
  { title: "True 10-bit cinema delivery", description: "No blown-out phone-sensor footage. Strictly D-Log / ProRes 4K files, colour-graded and stabilised for your final edit." },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    name: "Real estate",
    price: "₹12,000+",
    description:
      "Per property shoot. Ideal for brokers, builders, and owners listing in Hyderabad.",
    features: [
      "Up to 30 min flight time",
      "20+ edited aerial photos",
      "48-hour delivery",
      "DGCA-licensed pilot",
    ],
  },
  {
    name: "Weddings & events",
    price: "₹18,000+",
    description:
      "Per event. The most popular choice for wedding planners and families across Hyderabad.",
    features: [
      "Up to 1 hr flight time",
      "4K edited highlight video",
      "Aerial photos included",
      "Discreet, professional pilot",
    ],
    popular: true,
  },
  {
    name: "Corporate & events",
    price: "₹25,000+",
    description:
      "Custom day rates for product launches, campus flyovers, open-air concerts, and B2B events across Hyderabad.",
    features: [
      "Full-day pilot assignment",
      "4K cinema-grade video",
      "Multiple locations & angles",
      "Priority scheduling",
      "Custom post-processing",
    ],
  },
  {
    name: "Construction",
    price: "Custom",
    description:
      "Monthly plans for sites across HMDA zones and the Outer Ring Road corridor.",
    features: [
      "Recurring shoot plans",
      "Orthomosaic mapping",
      "Stakeholder-ready reports",
      "Bulk shoot discounts",
      "Dedicated pilot assignment",
    ],
  },
];

export const GUARANTEES: Guarantee[] = [
  {
    title: "DGCA-licensed",
    description:
      "Valid Remote Pilot Certificate. Fully legal, compliant with Hyderabad airspace rules.",
  },
  {
    title: "50% advance, balance after delivery",
    description:
      "Pay 50% to confirm the shoot. Balance is due only once you have the footage in hand.",
  },
  {
    title: "48-hour delivery",
    description:
      'Edited photos and video within 48 hours. Every time — no "we\'ll send it this week."',
  },
  {
    title: "Hyderabad-local",
    description:
      "Our pilots know the no-fly zones, golden hours, and shooting windows across the city.",
  },
];

export const FAQS: FaqItem[] = [
  {
    question: "Is drone photography legal in Hyderabad?",
    answer:
      "Yes — when done by a DGCA-licensed Remote Pilot using a registered drone. Every DroneHire pilot holds a valid Remote Pilot Certificate and files the necessary permissions. We do not fly in restricted zones (near airports, defence areas, or the secretariat) without prior clearance.",
  },
  {
    question: "How quickly can I get a pilot?",
    answer:
      "For most Hyderabad locations we can confirm a pilot within a few hours. For weekend weddings or large events we recommend booking at least 3–5 days in advance to guarantee availability.",
  },
  {
    question: "What if I'm not happy with the footage?",
    answer:
      "We send you a watermarked low-res preview before your final payment is due. Your 50% balance is paid only after you've approved the preview. If there's a quality issue, we'll arrange a reshoot or adjustment — you never pay the balance for footage you haven't signed off on.",
  },
  {
    question: "Which areas of Hyderabad do you cover?",
    answer:
      "We cover the full Hyderabad metro — Gachibowli, Banjara Hills, Jubilee Hills, Hitec City, Kondapur, Madhapur, LB Nagar, Kukatpally, Kompally, and surrounding areas. For outskirts or farmhouse locations we may apply a travel surcharge — confirmed before booking.",
  },
  {
    question: "What equipment do the pilots use?",
    answer:
      "Most pilots fly DJI Mavic 3, DJI Air 3, or equivalent professional-grade drones capable of 4K video and 48MP stills. Specific equipment can be requested when you message us.",
  },
];

export const FOOTER_TAGLINE =
  "Hyderabad's drone pilot booking platform. DGCA-licensed pilots for real estate, weddings, and construction.";

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Services",
    links: [
      { label: "Real estate", href: "/#services" },
      { label: "Weddings", href: "/#services" },
      { label: "Construction", href: "/#services" },
      { label: "Events", href: "/#services" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Pricing", href: "/#pricing" },
      { label: "FAQ", href: "/#faq" },
      { label: "Pilot network", href: "/pilots" },
    ],
  },
  {
    title: "Platform",
    links: [
      { label: "Airspace Map", href: "/map" },
      { label: "Drone Sim", href: "/game" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "WhatsApp", href: WHATSAPP_URL },
      { label: EMAIL, href: `mailto:${EMAIL}` },
    ],
  },
];

export const FOOTER_LEGAL = "© 2026 DroneHire · Hyderabad, Telangana";
export const FOOTER_DISCLAIMER =
  "All pilots are DGCA-licensed. Prices subject to confirmation.";
