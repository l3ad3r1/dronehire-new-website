import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Drone Mission Planner — DroneHire",
  description: "Plan drone photography missions over Hyderabad in 3D. Position camera waypoints, check airspace, configure altitude and gimbal angles, and book a verified pilot.",
};

export default function MissionPlannerLayout({ children }: { children: React.ReactNode }) {
  return children;
}
