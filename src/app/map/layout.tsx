import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Airspace Map — DroneHire",
  description:
    "Interactive DGCA airspace map for Hyderabad — check red and yellow zones across 55+ airports and facilities before you fly.",
};

export default function MapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
