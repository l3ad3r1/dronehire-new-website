import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Training | DroneHire",
  description:
    "Build confidence with DroneHire Flight Lab: a free, browser-based Mavic-style trainer for takeoff, hovering, orientation, navigation and landing.",
  alternates: { canonical: "/training" },
};

export default function TrainingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
