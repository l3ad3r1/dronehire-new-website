import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { REFUND } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Cancellation & Refund Policy — DroneHire",
  description: REFUND.description,
  robots: { index: false, follow: true },
};

export default function RefundPage() {
  return <LegalPage page={REFUND} />;
}
