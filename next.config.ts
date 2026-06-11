import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'brasilbcn.com' }],
        destination: 'https://www.brasilbcn.com/:path*',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
