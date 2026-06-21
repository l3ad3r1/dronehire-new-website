// Verbatim content extracted from https://dronehire.base44.app/pilots
import type {
  NavLink,
  ProcessStep,
  Benefit,
  EarningCard,
  Requirement,
  GalleryItem,
  FaqItem,
} from "@/types";

export const PILOT_NAV_LINKS: NavLink[] = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Requirements", href: "#requirements" },
  { label: "FAQ", href: "#faq" },
  { label: "Book a shoot", href: "/" },
];

export const PILOT_HERO_BENEFITS: Benefit[] = [
  {
    title: "You choose your availability",
    description: "Accept only the shoots that fit your calendar. No minimums.",
  },
  {
    title: "Fast, reliable payment",
    description: "Paid within 48 hours of delivering the edited footage.",
  },
  {
    title: "Shoots near you",
    description: "We match jobs to your area — no long-distance travel unless you want it.",
  },
];

export const EXPERIENCE_OPTIONS = [
  "Less than 1 year",
  "1–2 years",
  "3–5 years",
  "5+ years",
];

export const PILOT_SHOOT_TYPES = [
  "Real estate",
  "Weddings & events",
  "Construction / surveying",
  "All of the above",
];

export const APPLY_CONSENT =
  "I hold a valid DGCA Remote Pilot Certificate and the details above are accurate.";

export const PILOT_JOURNEY: ProcessStep[] = [
  {
    number: "01",
    title: "Apply in 2 minutes",
    description:
      "Fill in the form above with your DGCA certificate number, drone model, and the areas you fly in. No fee, no paperwork to post.",
  },
  {
    number: "02",
    title: "We verify & onboard you",
    description:
      "We confirm your DGCA certificate on WhatsApp and add you to the pilot pool for your areas. Usually done within 24 hours.",
  },
  {
    number: "03",
    title: "Accept shoots, get paid",
    description:
      "When a shoot comes in near you, we send the details on WhatsApp. You have 2 hours to accept or pass — then fly, deliver edited footage, and get paid within 48 hours.",
  },
];

export const EARNINGS: EarningCard[] = [
  {
    amount: "₹10,000+",
    label: "Per real estate shoot",
    description:
      "A single 30-min shoot in Gachibowli or Banjara Hills. Multiple possible per day.",
  },
  {
    amount: "₹15,000+",
    label: "Per wedding / event",
    description:
      "Weekend shoots for function halls in Kondapur, farmhouses near Shamirpet, and more.",
  },
  {
    amount: "Recurring",
    label: "Construction contracts",
    description:
      "Weekly or monthly site surveys for builders across HMDA zones and the ORR corridor.",
  },
];

export const REQUIREMENTS: Requirement[] = [
  {
    title: "Valid DGCA Remote Pilot Certificate",
    description: "Mandatory. Must be current and in your name.",
  },
  {
    title: "Registered drone (UAS)",
    description:
      "Your drone must be registered with DGCA. DJI Mavic 3, Air 3, or equivalent preferred.",
  },
  {
    title: "4K video capability",
    description: "Clients expect 4K footage. Drones that shoot below 4K will not qualify.",
  },
  {
    title: "Basic post-processing",
    description:
      "Colour correction and light editing in Lightroom, DaVinci Resolve, or similar.",
  },
  {
    title: "Based in or near Hyderabad",
    description:
      "Must be available for shoots within the Hyderabad metro. Outskirts pilots also welcome.",
  },
  {
    title: "Active WhatsApp & quick to respond",
    description:
      "All shoot coordination, briefings, and payments happen over WhatsApp.",
  },
];

export const REQUIREMENTS_CALLOUT = {
  title: "Not sure you qualify?",
  body: "If you have your DGCA certificate and a capable drone, you almost certainly do. We work with pilots at every experience level. We care more about reliability and output quality than years on paper. If you can deliver clean, edited 4K aerial footage on time, we want to work with you.",
};

export const GALLERY_INTRO =
  "A sample of aerial footage shot by DroneHire-verified pilots across Hyderabad.";

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    image: "/images/service-real-estate.png",
    badge: "Real estate",
    title: "Real estate aerial",
    location: "Gachibowli, Hyderabad",
    videoId: "cRtVxaGi5NI",
  },
  {
    image: "/images/service-weddings.png",
    badge: "Weddings",
    title: "Wedding venue flyover",
    location: "Banjara Hills, Hyderabad",
    videoId: "T3kxMgF0Peo",
  },
  {
    image: "/images/service-construction.png",
    badge: "Construction",
    title: "Construction progress survey",
    location: "HITEC City, Hyderabad",
    videoId: "GUjMW6PdE8Y",
  },
  {
    image: "/images/service-corporate.png",
    badge: "Corporate",
    title: "Corporate event coverage",
    location: "Jubilee Hills, Hyderabad",
    videoId: "rPJPK8bHLEQ",
  },
  {
    image: "/images/pilots/gallery-cityscape.jpg",
    badge: "Cityscape",
    title: "Cityscape sunrise reveal",
    location: "Hussain Sagar, Hyderabad",
  },
  {
    image: "/images/pilots/gallery-farmhouse.jpg",
    badge: "Golden hour",
    title: "Golden hour farmhouse",
    location: "Shamirpet, Hyderabad",
  },
];

export const PILOT_FAQS: FaqItem[] = [
  {
    question: "Is there a fee to join DroneHire?",
    answer:
      "No. Joining is completely free. We take a platform fee from the booking value — exact percentage shared during onboarding. You never pay us upfront.",
  },
  {
    question: "How do I receive payment?",
    answer:
      "Payments are made via UPI (GPay, PhonePe, Paytm) within 48 hours of the client confirming delivery. No delays, no chasing.",
  },
  {
    question: "Can I choose which shoots I accept?",
    answer:
      "Yes. We send you shoot details — location, date, type, and rate — and you confirm if you're available. There are no minimums and no penalties for declining.",
  },
  {
    question: "Do I need my own editing setup?",
    answer:
      "Yes. You're responsible for editing and delivering the final files. Basic colour grading and stabilisation are expected.",
  },
  {
    question: "What if something goes wrong on a shoot?",
    answer:
      "Contact us immediately on WhatsApp. We handle client communication and help resolve scheduling or quality issues.",
  },
  {
    question: "Do I need my own insurance?",
    answer:
      "Third-party drone insurance is strongly recommended and may be required for certain shoot locations. We can point you to options during onboarding.",
  },
];
