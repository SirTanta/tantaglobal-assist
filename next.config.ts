import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/blog/:path*",
        destination: "https://tantaholdings.com/blog",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
