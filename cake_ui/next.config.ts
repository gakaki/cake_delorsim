import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img01.yzcdn.cn',"mmbiz.qpic.cn"]
  }
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'http',
  //       hostname: '**',
  //     },
  //     {
  //       protocol: 'https',
  //       hostname: '**',
  //     }
  //   ]
  // }
};

export default nextConfig;
