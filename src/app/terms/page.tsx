import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { TERMS } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service — DroneHire",
  description: TERMS.description,
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return <LegalPage page={TERMS} />;
}
