import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  async redirects() {
    return [{ source: "/game", destination: "/training", permanent: true }];
  },
};

export default nextConfig;
