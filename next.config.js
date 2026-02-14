/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
  
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "s3.zoommer.ge",
          pathname: "/**",
        },
        {
          protocol: "https",
          hostname: "zoommer.ge",
          pathname: "/**",
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  