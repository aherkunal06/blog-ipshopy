import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["res.cloudinary.com", "images.unsplash.com"], // ✅ for Cloudinary and Unsplash
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pinimg.com", // ✅ for Pinterest
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com", // ✅ for Unsplash dummy images
      },
    ],
  },
};

export default nextConfig;

