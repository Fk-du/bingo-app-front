import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['40c7-2a09-bac1-27c0-cc0-00-3b7-44.ngrok-free.app'],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
      {
        source: "/ws/:path*",
        destination: "http://localhost:8080/ws/:path*",
      },
    ];
  },
};

export default nextConfig;
