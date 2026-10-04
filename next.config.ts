import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/analytics", destination: "/dashboard?tab=analytics" },
      { source: "/customers", destination: "/dashboard?tab=customers" },
      { source: "/orders", destination: "/dashboard?tab=orders" },
      { source: "/settings", destination: "/dashboard?tab=settings" },
      { source: "/help", destination: "/dashboard?tab=help" },
    ];
  },
};

export default nextConfig;
