import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:7015/api/:path*'
      }
    ]
  },
  experimental: {
    // @ts-ignore
    proxyTimeout: 30000,
  }
};

export default nextConfig;
