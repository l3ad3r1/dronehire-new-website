// Canonical site origin. The dronehire-new-website.vercel.app subdomain is
// dead (DEPLOYMENT_NOT_FOUND); production is served from the dronehire alias.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dronehire.vercel.app";
