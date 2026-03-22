import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "memoi-product-sg.s3-website-ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "memoi-product-per.s3-website-ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "memoi-product-per.s3-website-ap-southeast-1.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
