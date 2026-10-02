import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites(){
    return [
      {
        source: '/api/:path*',
        destination: 'https://localhost:7015/api/:path*'
      }
    ]
  }
};

export default nextConfig;
