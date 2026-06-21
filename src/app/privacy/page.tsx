import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PRIVACY } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy — DroneHire",
  description: PRIVACY.description,
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return <LegalPage page={PRIVACY} />;
}
