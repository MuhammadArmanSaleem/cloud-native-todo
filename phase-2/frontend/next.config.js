/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false, // Remove or set to false since typedRoutes is not standard
  },
  images: {
    domains: ['localhost', '127.0.0.1'],
  },
};

module.exports = nextConfig;