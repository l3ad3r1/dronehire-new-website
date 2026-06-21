import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { PILOT_AGREEMENT } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Pilot Agreement — DroneHire",
  description: PILOT_AGREEMENT.description,
  robots: { index: false, follow: true },
};

export default function PilotAgreementPage() {
  return <LegalPage page={PILOT_AGREEMENT} />;
}
