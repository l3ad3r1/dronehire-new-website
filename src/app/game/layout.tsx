import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Training Simulator — DroneHire",
  description:
    "Practice drone flight in a free, browser-based 3D simulator built on Hyderabad's real DGCA airspace data. Learn the controls and airspace rules before you fly.",
};

export default function GameLayout({ children }: { children: React.ReactNode }) {
  return children;
}
