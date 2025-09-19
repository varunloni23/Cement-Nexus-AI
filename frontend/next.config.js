/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for Render deployment
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://cement-line.onrender.com',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'wss://cement-line.onrender.com',
  },
  eslint: {
    // Allow production builds to complete even with ESLint warnings
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to complete even with TypeScript errors
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig