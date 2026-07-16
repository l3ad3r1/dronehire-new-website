import type { MetadataRoute } from "next";

const BASE_URL = "https://dronehire-new-website.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/book", priority: 0.9, changeFrequency: "weekly" },
    { path: "/pilots", priority: 0.7, changeFrequency: "weekly" },
    { path: "/marketplace", priority: 0.5, changeFrequency: "weekly" },
    { path: "/map", priority: 0.5, changeFrequency: "monthly" },
    { path: "/game", priority: 0.4, changeFrequency: "monthly" },
    { path: "/pilot-agreement", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/refund", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ];

  return routes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
