/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@components": path.resolve(__dirname, "components"),
      "@utils": path.resolve(__dirname, "utils"),
      "@styles": path.resolve(__dirname, "styles"),
    };
    return config;
  },
};

module.exports = nextConfig;
