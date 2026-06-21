// Content structures for the DroneHire / SkyCommand landing page

export interface NavLink {
  label: string;
  href: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  description: string;
}

export interface Service {
  index: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
  whatsappMessage: string;
}

export interface TrustPoint {
  title: string;
  description: string;
}

export interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface Guarantee {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FooterColumn {
  title: string;
  links: NavLink[];
}

// --- Pilot recruitment page ---

export interface Benefit {
  title: string;
  description: string;
}

export interface EarningCard {
  amount: string;
  label: string;
  description: string;
}

export interface Requirement {
  title: string;
  description: string;
}

export interface GalleryItem {
  image: string;
  badge: string;
  title: string;
  location: string;
  videoId?: string;
}
