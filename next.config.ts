import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Accept any local /assets/** image
    localPatterns: [{ pathname: "/assets/**" }],
  },
};

export default nextConfig;
