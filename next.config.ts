import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Used for Google Photos
      },
      {
        protocol: "https",
        hostname: "drive.google.com", // Allow Google Drive direct links
      },
    ],
  },
};

export default nextConfig;
