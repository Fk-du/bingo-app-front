import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['552d-2a0d-5600-235-2000-aca0-b1e6-b87d-e9a6.ngrok-free.app'],
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